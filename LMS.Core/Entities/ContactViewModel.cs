using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    public class ContactViewModel
    {
        public int ContactId { get; set; } = 0;
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string Brand { get; set; } = "";
        public string DealerShipName { get; set; } = "";
        public string Locations { get; set; } = "";
        public string Type { get; set; } = "";
        public bool? ServiceInterestedIn { get; set; } = false;
        public string OtherGroupAffiliation { get; set; } = "";

        public string KeyContactPerson { get; set; } = "";
        public string Mobile { get; set; } = "";
        public string Email { get; set; } = "";
        public string OtherBrandAssociation { get; set; } = "";

        public string OtherBrandRegion { get; set; } = "";

        public long UserId { get; set; }
        public int? StatusId { get; set; }
        public string StatusName { get; set; }

       public List<AccountsId>? Accounts { get;set;}
        
    }

   
}
