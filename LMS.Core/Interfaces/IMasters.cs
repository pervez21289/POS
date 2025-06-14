using LMS.Core.Entities;

namespace LMS.Core.Interfaces
{
    public interface IMasters
    {
        Task<string> GetStatus();
        public Task<Result> SaveStatus(Status user);
        public Task<Result> SaveIndustryType(IndustryType industryType);
        public Task<Result> SaveBusinessType(BusinessType businessType);
        public Task<Result> SaveStatusOrder(List<Status> status);
        Task<string> GetIndustryType();
        Task<string> GetBusinessType();
        Task<string> GetBrands();
        Task<string> GetLocations(string Search);
        public Task<Result> SaveBrand(BrandViewModel brand);
        public Task<string> GetCities();
        Task<Result> SaveLocation(Location location);
    }
}
