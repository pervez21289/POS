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
using System.Security.Claims;

namespace LMS.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        public IUser _user;
       
        public readonly AppSettings _appSettings;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IErrorLogger _logger;

        public UserController(IUser user,  AppSettings appSettings, IWebHostEnvironment hostingEnvironment, IErrorLogger logger)
        {
            _user = user;
            _appSettings = appSettings;
            _logger = logger;
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
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                if(user.UserId==0)
                    user.CompanyID = Convert.ToInt32(User.FindFirstValue(ClaimTypes.NameIdentifier));

                var userId = await _user.CreateUserAsync(user);
                return Ok(new { userId });
            }
            catch (Exception ex)
            {
                // Log the exception (you can use a logging framework here)
                _logger.Log(ex);
                return StatusCode(500, ex.Message);
            }   
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _user.DeleteUserAsync(id);
            return NoContent();
        }


    }
}
