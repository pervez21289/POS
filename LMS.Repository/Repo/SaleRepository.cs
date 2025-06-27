using Dapper;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;


public class SaleRepository : BaseRepository,ISaleRepository
{

 

    public async Task<int> SaveSaleAsync(SaleDto saleDto)
    {
      

        var saleItemsTable = new DataTable();
        saleItemsTable.Columns.Add("ProductID", typeof(int));
        saleItemsTable.Columns.Add("Quantity", typeof(int));
        saleItemsTable.Columns.Add("UnitPrice", typeof(decimal));
        saleItemsTable.Columns.Add("Discount", typeof(decimal));
        saleItemsTable.Columns.Add("Tax", typeof(decimal));

        foreach (var item in saleDto.saleItems)
        {
            saleItemsTable.Rows.Add(item.ProductID, item.Quantity, item.UnitPrice, item.Discount, item.Tax);
        }

        var parameters = new DynamicParameters();
        parameters.Add("@UserID", saleDto.UserID);
        parameters.Add("@TotalAmount", saleDto.TotalAmount);
        parameters.Add("@DiscountAmount", saleDto.DiscountAmount);
        parameters.Add("@TaxAmount", saleDto.TaxAmount);
        parameters.Add("@PaymentStatus", saleDto.PaymentStatus);
        parameters.Add("@Notes", saleDto.Notes);
        parameters.Add("@SaleItems", saleItemsTable.AsTableValuedParameter("dbo.SaleItemTableType"));
        parameters.Add("@SaleID", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await ExecuteScalarAsync<int>("SaveSaleWithItems", parameters, commandType: CommandType.StoredProcedure);
        return parameters.Get<int>("@SaleID");
    }

    public async Task<(IEnumerable<Sale> Rows, long Total)> GetSalesAsync(string search, DateTime? date, int page, int pageSize)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Search", string.IsNullOrWhiteSpace(search) ? null : search);
        parameters.Add("@Date", date);
        parameters.Add("@Page", page);
        parameters.Add("@PageSize", pageSize);

        IEnumerable<Sale> rows = await QueryAsync<Sale>("GetSalesWithFilters", parameters, commandType: CommandType.StoredProcedure);
        Sale sale= rows.FirstOrDefault();
        long total;
        if (sale == null)
        {
            total = 0;
        }
        else
        {
            total=sale.TotalCount;
        }

        return (rows, total);
    }
}
