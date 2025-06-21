using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly ISaleRepository _saleRepository;

    public SalesController(ISaleRepository saleRepository)
    {
        _saleRepository = saleRepository;
    }

    [HttpPost]
    public async Task<IActionResult> SaveSale([FromBody] SaleDto saleDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var saleId = await _saleRepository.SaveSaleAsync(saleDto);
        return Ok(new { SaleID = saleId, Message = "Sale saved successfully." });
    }
}
