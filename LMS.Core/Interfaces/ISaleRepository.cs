using LMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Interfaces
{
    public interface ISaleRepository
    {
        Task<BillNoDto> SaveSaleAsync(SaleDto saleDto);
        Task<(IEnumerable<Sale> Rows, long Total)> GetSalesAsync(string search, DateTime? date, int page, int pageSize);
        Task UpdateSaleOnPrintAsync(int saleId, string CustomerName, string mobile, string paymentMode);
        Task<SaleListDto?> GetSaleWithItems(int saleId);
    }
}
