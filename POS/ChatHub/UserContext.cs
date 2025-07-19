using LMS.Core.Interfaces;
using System.Security.Claims;

namespace LMS.ChatHub
{
    public class UserContext : IUserContext
    {
        public int CompanyID { get; }
      

        public UserContext(IHttpContextAccessor accessor)
        {
            var user = accessor.HttpContext?.User;

            if (user != null)
            {
                int.TryParse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value, out int companyId);
                CompanyID = companyId;
            }
        }
    }

}
