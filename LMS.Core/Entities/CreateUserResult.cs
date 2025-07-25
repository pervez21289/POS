using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    public class CreateUserResult
    {
        public int Success { get; set; }         // 1 = success, 0 = failure
        public string Message { get; set; }      // Status or error message
        public int? CreatedUserID { get; set; }  // User ID (only if success)
    }
}
