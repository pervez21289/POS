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
    [Route("api/[controller]")]
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

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _user.GetUsersAsync();
            return Ok(users);
        }

        [HttpPost("CreateOrUpdateUser")]
        public async Task<IActionResult> CreateOrUpdateUser([FromBody] User user)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var userId = await _user.CreateUserAsync(user);
            return Ok(new { userId });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _user.DeleteUserAsync(id);
            return NoContent();
        }


    }
}
