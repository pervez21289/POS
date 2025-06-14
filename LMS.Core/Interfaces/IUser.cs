
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
        Task<IEnumerable<Role>> GetRoles();
        //Task<string> GetMasters();

        Task<IEnumerable<UserViewModel>> GetUsers();
        public Task<Result> SaveUser(User user);
        public Task<UserViewModel> Login(User user);
        public Task<UserViewModel> ValidateOTP(User user);
        public Task<Result> PasswordReset(User user);
        public Task<UserViewModel> UpdateUser(User user, IFormFile formFile, string ServerPath);
        public Task<Result> SaveMessage(Messages message);

        public Task<string> GetMessages(long UserId);
        public Task<string> GetUser(long UserId);


    }
}
