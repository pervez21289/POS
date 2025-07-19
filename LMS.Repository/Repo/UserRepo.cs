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
using System.Reflection.Metadata;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Repo.Repository
{
    public class UserRepo : BaseRepository, IUser
    {

        public async Task<int> CreateUserAsync(User user)
        {
            if(!string.IsNullOrEmpty(user.PasswordHash))
            {
                       user.PasswordHash = ComputeSha256Hash(user.PasswordHash);    
            }
            else
            {
                user.PasswordHash = null;
            }

            var p = new DynamicParameters();
            p.Add("@FirstName", user.FirstName);
            p.Add("@Mobile", user.Mobile);
            p.Add("@Email", user.Email);
            p.Add("@PasswordHash", user.PasswordHash);
            p.Add("@CompanyID", user.CompanyID);
            p.Add("@UserId", user.UserId);
            // RoleIDs as Table-Valued Parameter
            var table = new DataTable();
            table.Columns.Add("RoleID", typeof(int));
            foreach (var id in user.RoleIDs)
            {
                table.Rows.Add(id);
            }
            p.Add("@Roles", table.AsTableValuedParameter("dbo.RoleIDTableType"));

            return await ExecuteScalarAsync<int>("CreateUserWithRole", p, commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteUserAsync(int userId)
        {
            await ExecuteAsync("DeleteUser", new { UserID = userId }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<User>> GetUsersAsync(int CompanyID)
        {
            return await QueryAsync<User>("GetUsersWithRoles", new { CompanyID=CompanyID},commandType: CommandType.StoredProcedure);
        }



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

            var (userDto, menuItems) = await QueryMultipleStringAsync<UserLoginDto, string>(
                   "UserLogin",
                  new { Email = email, Password = passwordHash },
                   commandType: CommandType.StoredProcedure
               );

            userDto.menuItemDtos = menuItems;
           
            return userDto;

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
