using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using System.Reflection.Emit;
using LMS.Repository.Utilities;
using Dapper;
using Newtonsoft.Json;

namespace LMS.Repository.Repo
{
    public class ContactRepo: BaseRepository, IContact
    {
        public async Task<Result> SaveContact(Contact contact)
        {
            try
            {
                var accoountDT = DTExtensions.ToDataTable(contact.Accounts);
                var contactData=  new
                {
                    ContactId = contact.ContactId,
    
                    FirstName = contact.FirstName
    ,
                    LastName = contact.LastName
    ,
                    Brand = contact.Brand
    ,
                    DealerShipName = contact.DealerShipName
    ,
                    Locations = contact.Locations
    ,
                    Type = contact.Type,
     
                    ServiceInterestedIn = contact.ServiceInterestedIn
    ,
                    OtherGroupAffiliation = contact.OtherGroupAffiliation

    ,
                    KeyContactPerson = contact.KeyContactPerson
    ,
                    Mobile = contact.Mobile
    ,
                    Email = contact.Email
    ,
                    OtherBrandAssociation = contact.OtherBrandAssociation

    ,
                    OtherBrandRegion = contact.OtherBrandRegion

      ,
                    UserId = contact.UserId,
                    StateId=contact.StateId,
                    City=contact.City,
                    Country=contact.Country,
                    Address=contact.Address,
                    AccountList= accoountDT.AsTableValuedParameter("dbo.AccountList")
                };
              

                return await QueryFirstOrDefaultAsync<Result>("SP_SaveContact", contactData);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Result> UpdateContact(ContactModel contact)
        {
            try
            {
                return await QueryFirstOrDefaultAsync<Result>("SP_UpdateContact", contact);
            }
            catch 
            {
                throw;
            }
        }
        public async Task<string> GetContacts(long? UserId)
        {
            var data= await QueryFirstOrDefaultAsync<string>("SP_GetContacts",new {UserId=UserId});
           
            return data;
        }

        public async Task<string> GetStatus()
        {
            var data = await QueryFirstOrDefaultAsync<string>("SP_GetStatus");

            return data;
        }
        public async Task<string> GetDashboard(long? UserId)
        {
            var data = await QueryFirstOrDefaultAsync<string>("SP_GetDashboard", new { UserId = UserId });
            return data;
        }

        public async Task<string> GetStates()
        {
            var data = await QueryFirstOrDefaultAsync<string>("SP_GetStates");

            return data;
        }
    }
}
