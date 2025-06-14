using LMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Interfaces
{
    public interface IAccounts
    {
        public Task<Result> SaveAccount(Accounts accounts);
        public Task<IEnumerable<AccountsViewModel>> GetAccount(long? UserId);
        public Task<IEnumerable<BusinessType>> GetBusinessType();
        public Task<IEnumerable<ContactMode>> GetContactMode();

        public Task<IEnumerable<IndustryType>> GetIndustryType();

        public Task<string> GetContactAccount();
    }
}
