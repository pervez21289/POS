using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Data;

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

        var saleId = await _saleRepository.SaveSaleAsync(saleDto);
        return Ok(new { SaleID = saleId, Message = "Sale saved successfully." });
    }

    //[HttpPost("UpdateOnPrint")]
    //public async Task<IActionResult> UpdateOnPrint([FromBody] UpdatePrintDto dto)
    //{
    //    await _saleRepository.UpdateSaleOnPrintAsync(dto.SaleId, dto.CustomerName, dto.Mobile, dto.PaymentMode);
    //    return Ok();
    //}
}
