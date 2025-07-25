using LMS.ChatHub;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly ISaleRepository _saleRepository;
    private readonly IUserContext _userContext;

    public SalesController(ISaleRepository saleRepository, IUserContext userContext)
    {
        _saleRepository = saleRepository;
        _userContext = userContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetSales([FromQuery] string? search, [FromQuery] DateTime? date, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
       
        (IEnumerable<Sale> rows, long total) data = await _saleRepository.GetSalesAsync(search, _userContext.CompanyID, date, page, pageSize);
        return Ok(new { data.rows, data.total });
    }

    [HttpPost]
    public async Task<IActionResult> SaveSale([FromBody] SaleDto saleDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        saleDto.UserID = _userContext.UserId;

        BillNoDto bill = await _saleRepository.SaveSaleAsync(saleDto);
        return Ok(bill);
    }

    [HttpGet("GetSalesById/{saleId}")]
    public async Task<IActionResult> GetSalesById(int saleId)
    {
        var sale = await _saleRepository.GetSaleWithItems(saleId);
        return sale == null ? NotFound() : Ok(sale);
    }

    [HttpGet("GetCustomerByNumber/{mobilenumber}")]
    public async Task<IActionResult> GetCustomerByNumber(long mobilenumber)
    {
        var sale = await _saleRepository.GetCustomerByNumber(mobilenumber);
        return sale == null ? NotFound() : Ok(sale);
    }


    [HttpGet("GetMonthlySalesSummary")]
    public async Task<IActionResult> GetMonthlySalesSummary()
    {
        string data = await _saleRepository.GetMonthlySalesSummary(_userContext.CompanyID);
        return Ok(data);
    }

}
