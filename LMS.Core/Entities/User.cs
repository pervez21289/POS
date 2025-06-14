using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    public class  User
    {
        public long? UserId { get; set; }
        public string? Name { get; set; }
        public string? Password { get; set; } = "";
        public int?   RoleId { get; set; }
        public string? Email { get; set; } = "";
        public string? Mobile { get; set; }
        public string? OTP{get; set; } = "";
        public int? CityId { get; set; }
    }
}
