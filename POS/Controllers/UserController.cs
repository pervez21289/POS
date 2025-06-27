using Microsoft.AspNetCore.Mvc;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Amazon.Runtime.Internal;
using System.Drawing;

namespace LMS.Controllers
{

    [ApiController]
    public class UserController : ControllerBase
    {
        public IUser _user;
       
        public readonly AppSettings _appSettings;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public UserController(IUser user,  AppSettings appSettings, IWebHostEnvironment hostingEnvironment)
        {
            _user = user;
            _appSettings = appSettings;
        
            _hostingEnvironment = hostingEnvironment;
        }

       
    }
}
