using Dapper;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace LMS.Repository.Repo
{
    public class ProductRepository : BaseRepository,IProductRepository
    {
       

        public async Task<IEnumerable<Product>> GetAllAsync() =>
     await  QueryAsync<Product>("GetAllProducts", commandType: CommandType.StoredProcedure);

        public async Task<Product?> GetByIdAsync(int id) =>
            await  QueryFirstOrDefaultAsync<Product>(
                "GetProductById", new { ProductID = id }, commandType: CommandType.StoredProcedure);

        public async Task<int> CreateAsync(Product product) =>
            await  ExecuteScalarAsync<int>(
                "CreateProduct", new
                {
                    product.Name,
                    product.SKU,
                    product.Barcode,
                    product.Description,
                    product.Price,
                    product.CostPrice,
                    product.Stock,
                    product.CategoryID,
                    product.IsActive
                }, commandType: CommandType.StoredProcedure);

        public async Task<bool> UpdateAsync(Product product) =>
            (await  ExecuteAsync(
                "UpdateProduct", new
                {
                    product.ProductID,
                    product.Name,
                    product.SKU,
                    product.Barcode,
                    product.Description,
                    product.Price,
                    product.CostPrice,
                    product.Stock,
                    product.CategoryID,
                    product.IsActive
                }, commandType: CommandType.StoredProcedure)) > 0;

        public async Task<bool> DeleteAsync(int id) =>
            (await  ExecuteAsync(
                "DeleteProduct", new { ProductID = id }, commandType: CommandType.StoredProcedure)) > 0;

    }
}
