using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LMS.Controllers
{
    
    [ApiController]
    public class AccountController : ControllerBase
    {
        public readonly AppSettings _appSettings;
        public IUser _user;
        public AccountController(IUser user, AppSettings appSettings)
        {
            _user = user;
            _appSettings = appSettings;
        }

        //[HttpPost]
        //[Route("api/SaveUser")]
        //public async Task<Result> SaveUser(User user)
        //{

        //    return await _user.SaveUser(user);
        //}

        [HttpPost]
        [Route("api/Login")]
        public async Task<IActionResult> Login(User user)
        {

            UserViewModel userData = await _user.Login(user);
            if (userData != null)
            {
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, Convert.ToString(user.UserId)),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                authClaims.Add(new Claim(ClaimTypes.Role, userData.RoleName));
                var token = GetToken(authClaims);

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo,
                    userId= user.UserId
                });
            }
            return Unauthorized();
        }
        [HttpPost]
        [Route("api/PasswordReset")]
        public async Task<Result> PasswordReset(User user)
        {
            return await _user.PasswordReset(user);
        }

        private JwtSecurityToken GetToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.TSecret));

            var token = new JwtSecurityToken(
                issuer: _appSettings.ValidIssuer,
                audience: _appSettings.ValidAudience,
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }
    }
}
