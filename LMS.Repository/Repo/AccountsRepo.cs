using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Repository.Repo
{
    public class AccountsRepo: BaseRepository, IAccounts
    {
        public async Task<Result> SaveAccount(Accounts accounts)
        {
            try
            {
                return await QueryFirstOrDefaultAsync<Result>("SP_SaveAccount", accounts);
            }
            catch
            {
                throw;
            }
        }
        public async Task<IEnumerable<AccountsViewModel>> GetAccount(long? UserId)
        {
            return await Query<AccountsViewModel>("SP_GetAccount",new { UserId = UserId });
        }

        public async Task<IEnumerable<BusinessType>> GetBusinessType()
        {
            return await Query<BusinessType>("SP_GetBusinessType");
        }
        public async Task<IEnumerable<ContactMode>> GetContactMode()
        {
            return await Query<ContactMode>("SP_GetContactMode");
        }

        public async Task<IEnumerable<IndustryType>> GetIndustryType()
        {
            return  await Query<IndustryType>("SP_GetIndustryType");
        }
        public async Task<string> GetContactAccount()
        {
            return await QueryFirstOrDefaultAsync<string>("SP_GetContactAccount");
        }
    }
}
