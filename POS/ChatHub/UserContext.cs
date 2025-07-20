using LMS.Core.Interfaces;
using System.Security.Claims;

namespace LMS.ChatHub
{
    public class UserContext : IUserContext
    {
        public int CompanyID { get; }
        public int UserId { get; }

        public UserContext(IHttpContextAccessor accessor)
        {
            var user = accessor.HttpContext?.User;

            if (user != null)
            {
                int.TryParse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value, out int companyId);
                int.TryParse(user.FindFirst(ClaimTypes.Name)?.Value, out int userId);

                CompanyID = companyId;
                UserId = userId;
            }
        }
    }

}
