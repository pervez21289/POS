using LMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Interfaces
{
    public interface IContact
    {
        public Task<Result> SaveContact(Contact contact);
        public Task<Result> UpdateContact(ContactModel contact);
        public Task<string> GetContacts(long? UserId);
        public Task<string> GetStatus();
        public Task<string> GetStates();
        public Task<string> GetDashboard(long? UserId);
    }
}
