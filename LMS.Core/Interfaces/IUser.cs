
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;
using LMS.Core.Entities;
using Microsoft.AspNetCore.Http;

namespace LMS.Core.Interfaces
{
    public interface IUser
    {
        Task<CreateUserResult> RegisterCompanyWithAdminAsync(RegisterRequest request);
        Task<UserLoginDto?> LoginAsync(string email, string password);

    }
}
