using Amazon.Runtime.Internal.Endpoints.StandardLibrary;
using Dapper;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Drawing.Imaging;
using System.Net;
using System.Net.Mail;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Repo.Repository
{
    public class UserRepo : BaseRepository, IUser
    {
        public async Task<CreateUserResult> RegisterCompanyWithAdminAsync(RegisterRequest request)
        {
            var passwordHash = ComputeSha256Hash(request.Password);

            var result = await QueryFirstOrDefaultAsync<CreateUserResult>(
                "CreateCompanyWithAdmin",
                new
                {
                    CompanyName = request.Company,
                    FirstName = request.FirstName,
                    Mobile = request.Mobile,
                    Email = request.Email,
                    PasswordHash = passwordHash // Example
                },
                commandType: CommandType.StoredProcedure
            );

            return result;
        }

        public async Task<UserLoginDto?> LoginAsync(string email, string password)
        {
            var passwordHash = ComputeSha256Hash(password);

            var result = await QueryFirstOrDefaultAsync<UserLoginDto>(
                "UserLogin",
                new { Email = email, Password = passwordHash },
                commandType: CommandType.StoredProcedure
            );
            return result;
        }

        private string ComputeSha256Hash(string rawData)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(rawData));

            var builder = new StringBuilder();
            foreach (var b in bytes)
                builder.Append(b.ToString("x2"));

            return builder.ToString();
        }
    }
}
