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
    public class RegisterRequest
    {
        public string Company { get; set; }
        public string FirstName { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UserLoginDto
    {
        public int UserID { get; set; }
        public string FirstName { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public int CompanyID { get; set; }
        public string CompanyName { get; set; }
        public string RoleName { get; set; }
    }
}
