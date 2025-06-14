using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace LMS.Controllers
{
    [Authorize]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        public IAccounts _account;
        public AccountsController(IAccounts acount)
        {
            _account = acount;
        }

        [HttpGet]
        [Route("api/GetAccounts")]
        public async Task<IEnumerable<AccountsViewModel>> GetAccounts(long? UserId)
        {

            return await _account.GetAccount(UserId);
        }


        [HttpGet]
        [Route("api/GetBusinessType")]
        public async Task<IEnumerable<BusinessType>> GetBusinessType()
        {

            return await _account.GetBusinessType();
        }


        [HttpGet]
        [Route("api/GetContactMode")]
        public async Task<IEnumerable<ContactMode>> GetContactMode()
        {

            return await _account.GetContactMode();
        }


        [HttpGet]
        [Route("api/GetIndustryType")]
        public async Task<IEnumerable<IndustryType>> GetIndustryType()
        {

            return await _account.GetIndustryType();
        }

        [HttpGet]
        [Route("api/GetContactAccount")]
        public async Task<string> GetContactAccount()
        {

            return await _account.GetContactAccount();
        }

        [HttpPost]
        [Route("api/SaveAccount")]
        public async Task<Result> SaveAccount(Accounts accounts)
        {
            try
            {
                return await _account.SaveAccount(accounts);
            }
            catch(Exception e)
            {
                throw e;
            }
        }


    }
}
