﻿
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
        Task<int> CreateUserAsync(User user);
        Task DeleteUserAsync(int userId);
        Task<IEnumerable<User>> GetUsersAsync(int CompanyID);
        Task<IEnumerable<ApiLog>> GetApiLogsAsync(string search, DateTime? startDate, DateTime? endDate);

    }
}
