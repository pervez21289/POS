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

        public ProductsController(IProductRepository repo, IErrorLogger logger)
        {
            _repo = repo;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(string? search)
        {
            try
            {
                return Ok(await _repo.GetAllAsync(search));
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
                product.CompanyID = Convert.ToInt32(User.FindFirstValue(ClaimTypes.NameIdentifier));

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
        public async Task<IActionResult> Search(string q)
        {
            var result = await _repo.SearchProductsAsync(q ?? "");
            return Ok(result);
        }


        [HttpPost("{id}/adjust-stock")]
        public async Task<IActionResult> AdjustStock(int id, [FromBody] AdjustStockDto dto)
        {
            try
            {
                var success = await _repo.AdjustStockAsync(id, dto.Quantity, dto.Reason, dto.UserID);
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
    }

}
