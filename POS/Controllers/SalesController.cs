using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly ISaleRepository _saleRepository;

    public SalesController(ISaleRepository saleRepository)
    {
        _saleRepository = saleRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetSales([FromQuery] string? search, [FromQuery] DateTime? date, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        (IEnumerable<Sale> rows, long total) data = await _saleRepository.GetSalesAsync(search, date, page, pageSize);
        return Ok(new { data.rows, data.total });
    }

    [HttpPost]
    public async Task<IActionResult> SaveSale([FromBody] SaleDto saleDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

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
    public async Task<IActionResult> GetMonthlySalesSummary(int CompanyID)
    {
       
        var data = await _saleRepository.GetMonthlySalesSummary(CompanyID);

        

        return Ok(data);
    }

}
