using Amazon.Runtime.Internal;
using LMS.ChatHub;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.Drawing;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Claims;
using System.Text;

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
        private readonly IUserContext _userContext;

        public UserController(IUser user,  AppSettings appSettings, IWebHostEnvironment hostingEnvironment, IErrorLogger logger, IUserContext userContext)
        {
            _user = user;
            _appSettings = appSettings;
            _logger = logger;
            _hostingEnvironment = hostingEnvironment;
            _userContext = userContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
          
            var users = await _user.GetUsersAsync(_userContext.CompanyID);
            return Ok(users);
        }

        [HttpPost("CreateOrUpdateUser")]
        public async Task<IActionResult> CreateOrUpdateUser([FromBody] User user)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                if(user.UserId==0)
                    user.CompanyID = _userContext.CompanyID;

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

        [HttpGet("ApiLogs")]
        public async Task<IActionResult> ApiLogs([FromQuery] string? search, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var logs = await _user.GetApiLogsAsync(search, startDate, endDate);
            return Ok(logs);
        }
    }
}
