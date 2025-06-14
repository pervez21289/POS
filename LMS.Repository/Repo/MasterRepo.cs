using Dapper;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using LMS.Repository.Utilities;
using System.Linq.Expressions;

namespace LMS.Repository.Repo
{
    public class MasterRepo : BaseRepository, IMasters
    {
        public async Task<string> GetStatus()
        {
            return await QueryFirstOrDefaultAsync<string>("SP_GetStatus");
        }

        public async Task<string> GetIndustryType()
        {
            return await QueryFirstOrDefaultAsync<string>("SP_GetIndustryType");
        }
        public async Task<string> GetBusinessType()
        {
            return await QueryFirstOrDefaultAsync<string>("SP_GetBusinessType");
        }

        public async Task<string> GetBrands()
        {
            return await QueryFirstOrDefaultAsync<string>("SP_GetBrands");
        }

        public async Task<Result> SaveStatus(Status status)
        {
            return await QueryFirstOrDefaultAsync<Result>("SP_SaveStatus", status);

        }

        public async Task<Result> SaveIndustryType(IndustryType industryType)
        {
            return await QueryFirstOrDefaultAsync<Result>("SP_SaveIndustryType", industryType);

        }

        public async Task<Result> SaveBusinessType(BusinessType businessType)
        {
            return await QueryFirstOrDefaultAsync<Result>("SP_SaveBusinessType", businessType);

        }

        public async Task<Result> SaveStatusOrder(List<Status> status)
        {
            var statudDT = DTExtensions.ToDataTable(status);

            return await QueryFirstOrDefaultAsync<Result>("SP_SaveStatusOrder", new { LeadStatus = statudDT.AsTableValuedParameter("dbo.LeadStatusOrder") });
        }

        public async Task<Result> SaveBrand(BrandViewModel brand)
        {
            return await QueryFirstOrDefaultAsync<Result>("SP_SaveBrand", brand);

        }

        public async Task<IEnumerable<States>> GetStates()
        {
            try
            {
                return await Query<States>("SP_GetAllStates");
            }
            catch(Exception ex) 
            {
                return null;
            
            }

        }

        public async Task<Result> SaveLocation(Location location)

        {
            return await QueryFirstOrDefaultAsync<Result>("SP_SaveLocation", location);

        }

        public async Task<string> GetLocations(string Search)
        {
            return await QueryFirstOrDefaultAsync<string>("SP_GetLocations",new {Search=Search});
        }

        public async Task<string> GetCities()
        {
            return await QueryFirstOrDefaultAsync<string>("SP_GetCities");
        }
    }
}
