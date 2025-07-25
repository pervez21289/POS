using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryRepository _repo;
    private readonly IErrorLogger _logger;
    protected readonly IUserContext _userContext;

    public CategoriesController(ICategoryRepository repo, IErrorLogger logger, IUserContext userContext)
    {
        _repo = repo;
        _logger = logger;
        _userContext = userContext;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try {
           
         return Ok(await _repo.GetAllAsync(_userContext.CompanyID)); }
        catch (Exception ex) { _logger.Log(ex); return StatusCode(500); }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        try
        {
            var result = await _repo.GetByIdAsync(id);
            return result == null ? NotFound() : Ok(result);
        }
        catch (Exception ex) { _logger.Log(ex); return StatusCode(500); }
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Category category)
    {
        try
        {
            category.CompanyID = _userContext.CompanyID;
            int id = await _repo.CreateAsync(category);
            return CreatedAtAction(nameof(Get), new { id }, category);
        }
        catch (Exception ex) { _logger.Log(ex); return StatusCode(500); }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Category category)
    {
        try
        {
            category.CategoryID = id;
            return await _repo.UpdateAsync(category) ? NoContent() : NotFound();
        }
        catch (Exception ex) { _logger.Log(ex); return StatusCode(500); }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            return await _repo.DeleteAsync(id) ? NoContent() : NotFound();
        }
        catch (Exception ex) { _logger.Log(ex); return StatusCode(500); }
    }
}
