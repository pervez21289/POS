using BunnyCDN.Net.Storage.Models;
using LMS.Core.Entities;
using Microsoft.AspNetCore.Http;

namespace LMS.Core.Interfaces
{
    public interface IProperty
    {
        Task<Result> SaveLocation(Location location);
        Task<Result> SaveProperty(Property property, List<IFormFile> formFiles, string FilePath);
        Task<IEnumerable<PropertyModel>> GetProperties(LocationModel Location);
        Task<List<StorageObject>> GetStorageObjectsAsync(string path);
        Task<PropertyModel> GetProperty(long propertyId);
        public Task<Result> SaveWishList(long UserId, long PropertyId);
        Task<IEnumerable<PropertyModel>> GetWishList(long userId);
        Task<IEnumerable<PropertyModel>> GetUserProperties(long userId);
        Task<Result> SavePhoto(Property property, List<IFormFile> formFiles, string FilePath);
    }
}
