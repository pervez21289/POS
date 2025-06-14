using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Controllers
{
    //[Authorize]
    [ApiController]
    public class MasterController : ControllerBase
    {
        public IMasters _masters;
        public MasterController(IMasters masters)
        {
            _masters = masters;
        }

        [HttpGet]
        [Route("api/GetStatus")]
        public async Task<string> GetStatus()
        {
            return await _masters.GetStatus();
        }

        [HttpGet]
        [Route("api/GetIndustryType")]
        public async Task<string> GetIndustryType()
        {
            return await _masters.GetIndustryType();
        }

        [HttpGet]
        [Route("api/GetBusinessType")]
        public async Task<string> GetBusinessType()
        {

            return await _masters.GetBusinessType();
        }

        [HttpGet]
        [Route("api/GetBrands")]
        public async Task<string> GetBrands()
        {
            return await _masters.GetBrands();
        }

        [HttpGet]
        [Route("api/GetLocations")]
        public async Task<string> GetLocations(string Search)
        {
            return await _masters.GetLocations(Search);
        }


        [HttpGet]
        [Route("api/GetCities")]
        public async Task<string> GetCities()
        {
            return await _masters.GetCities();
        }


        [HttpPost]
        [Route("api/SaveStatus")]
        public async Task<Result> SaveStatus(Status status)
        {
            try
            {
                return await _masters.SaveStatus(status);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("api/SaveIndustryType")]
        public async Task<Result> SaveIndustryType(IndustryType industryType)
        {
            try
            {
                return await _masters.SaveIndustryType(industryType);
            }
            catch (Exception)
            {
                throw;
            }

        }

        [HttpPost]
        [Route("api/SaveBusinessType")]
        public async Task<Result> SaveBusinessType(BusinessType businessType)
        {
            try
            {
                return await _masters.SaveBusinessType(businessType);
            }
            catch (Exception)
            {
                throw;
            }

        }


        [HttpPost]
        [Route("api/SaveStatusOrder")]
        public async Task<Result> SaveStatusOrder(List<Status> status)
        {
            try
            {
                return await _masters.SaveStatusOrder(status);
            }
            catch (Exception)
            {
                throw;
            }

        }

        [HttpPost]
        [Route("api/SaveBrand")]
        public async Task<Result> SaveBrand(BrandViewModel brand)
        {
            try
            {
                return await _masters.SaveBrand(brand);
            }
            catch (Exception)
            {
                throw;
            }

        }
    }
}
