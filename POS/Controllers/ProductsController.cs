using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LMS.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _repo;
        private readonly IErrorLogger _logger;
        protected readonly IUserContext _userContext;

        public ProductsController(IProductRepository repo, IErrorLogger logger, IUserContext userContext)
        {
            _repo = repo;
            _logger = logger;
            _userContext = userContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(string? search)
        {
            try
            {
                return Ok(await _repo.GetAllAsync(search, _userContext.CompanyID));
            }
            catch (Exception ex)
            {
                _logger.Log(ex);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var product = await _repo.GetByIdAsync(id);
                return product == null ? NotFound() : Ok(product);
            }
            catch (Exception ex)
            {
                _logger.Log(ex);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create(Product product)
        {
            try
            {
                product.CompanyID = _userContext.CompanyID;
                var id = await _repo.CreateAsync(product);
                return CreatedAtAction(nameof(Get), new { id }, product);
            }
            catch (Exception ex)
            {
                _logger.Log(ex);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Product product)
        {
            if (id != product.ProductID) return BadRequest();

            try
            {
                var updated = await _repo.UpdateAsync(product);
                return updated ? NoContent() : NotFound();
            }
            catch (Exception ex)
            {
                _logger.Log(ex);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var deleted = await _repo.DeleteAsync(id);
                return deleted ? NoContent() : NotFound();
            }
            catch (Exception ex)
            {
                _logger.Log(ex);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search(string? q)
        {
    
            IEnumerable<Product> result = await _repo.SearchProductsAsync(q ?? "", _userContext.CompanyID);
            return Ok(result);
        }


        [HttpPost("{id}/adjust-stock")]
        public async Task<IActionResult> AdjustStock(int id, [FromBody] AdjustStockDto dto)
        {
            try
            {
                dto.UserID = _userContext.UserId;
                var success = await _repo.AdjustStockAsync(id, dto.Quantity, dto.Reason, dto.UserID.Value);
                return success ? Ok() : BadRequest();
            }
            catch (Exception ex)
            {
                _logger.Log(ex);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet("{id}/inventory-logs")]
        public async Task<IActionResult> GetInventoryLogs(int id)
        {
            try
            {
                var logs = await _repo.GetInventoryLogsAsync(id);
                return Ok(logs);
            }
            catch (Exception ex)
            {
                _logger.Log(ex);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("{id}/image")]
        public async Task<IActionResult> UploadProductImage(int id, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // Optional: validate file type/size
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var extension = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(extension))
                return BadRequest("Invalid file type. Allowed: jpg, jpeg, png, gif.");

            if (file.Length > 5 * 1024 * 1024) // 5 MB limit
                return BadRequest("File size exceeds 5 MB.");

            try
            {
                // 1. Save the file to wwwroot/images/products
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // 2. Build the URL to be stored
            
                var updated = await _repo.UpdateProductImageAsync(id, uniqueFileName);
                if (!updated)
                    return NotFound($"Product with ID {id} not found.");

                return Ok(new { imageUrl = uniqueFileName });
            }
            catch (Exception ex)
            {
                _logger.Log(ex);
                return StatusCode(500, "Internal Server Error");
            }
        }
    }

}
