using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
namespace LMS.Controllers
{
    
    [ApiController]
    public class ContactsController : ControllerBase
    {
        public IContact _contact;
        public ContactsController(IContact contact)
        {
            _contact = contact;
        }

        [HttpGet]
        [Route("api/GetDashboard")]
        public async Task<string> GetDashboard(long? UserId)
        {

            return await _contact.GetDashboard(UserId);
        }

        [HttpGet]
        [Route("api/GetContacts")]
        public async Task<string> GetContacts(long? UserId)
        {

            return await _contact.GetContacts(UserId);
        }

        [HttpGet]
        [Route("api/GetStates")]
        public async Task<string> GetStates()
        {

            return await _contact.GetStates();
        }

        [HttpGet]
        [Route("api/GetStatus")]
        public async Task<string> GetStatus()
        {

            return await _contact.GetStatus();
        }

        [HttpPost]
        [Route("api/SaveContact")]
        public async Task<Result> SaveContact(Contact contact)
        {

            return await _contact.SaveContact(contact);
        }

        [HttpPost]
        [Route("api/UpdateContact")]
        public async Task<Result> UpdateContact(ContactModel contact)
        {

            return await _contact.UpdateContact(contact);
        }

    }
}
