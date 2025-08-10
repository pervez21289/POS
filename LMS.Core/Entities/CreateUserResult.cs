using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    public class CreateUserResult
    {
        public int Success { get; set; }        
        public string Message { get; set; }      
        public int? CreatedUserID { get; set; }  
        public string? OTP { get; set; } 
    }
}
