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

        [HttpGet]
        [Route("api/GetUsers")]
        public async Task<IEnumerable<UserViewModel>> GetUsers()
        {

            return await _user.GetUsers();
        }

        [HttpGet]
        [Route("api/GetRoles")]
        public async Task<IEnumerable<Role>> GetRoles()
        {

            return await _user.GetRoles();
        }



        [HttpPost]
        [Route("api/ValidateOTP")]
        public async Task<IActionResult> ValidateOTP(User user)
        {
            try
            {
                var userData = await _user.ValidateOTP(user);
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
                        userData = userData
                    });
                }
                return Ok("Invalid OTP");
            }
            catch (Exception)
            {
                throw;
            }
        }


        [HttpPost]
        [Route("api/SaveUser")]
        public async Task<Result> SaveUser(User user)
        {
            try
            {
                return await _user.SaveUser(user);
            }
            catch (Exception)
            {
                throw;
            }
        }


        [HttpPost]
        [Route("api/SaveMessage")]
        public async Task<Result> SaveMessage(Messages message)
        {
            try
            {
                return await _user.SaveMessage(message);
            }
            catch (Exception)
            {
                throw;
            }
        }


        [HttpGet]
        [Route("api/GetMessages")]
        public async Task<string> GetMessages(long UserId)
        {
            return await _user.GetMessages(UserId);
        }

        [HttpGet]
        [Route("api/GetUser")]
        public async Task<string> GetUser(long UserId)
        {
            return await _user.GetUser(UserId);
        }


      

        [HttpGet]
        [Route("api/DeletePhoto")]
        public async Task<string> DeletePhoto(string ImageUrl)
        {
            try
            {
                var request = HttpContext.Request;
                var baseUri = new Uri($"{request.Scheme}://{request.Host}{request.PathBase}/Files/");
                Uri fileUri = new Uri(ImageUrl);
                string relativePath = baseUri.MakeRelativeUri(fileUri).ToString();

                string filePath = Path.Combine(_hostingEnvironment.ContentRootPath, "Files", relativePath);

                if (System.IO.File.Exists(filePath))
                {
                   
                    System.IO.File.Delete(filePath);
                    string fileName=Path.GetFileName(filePath);
                    if (fileName=="0.jpg")
                    {
                        string dirPath=Path.GetDirectoryName(filePath);
                        var sourcefile = Directory.GetFiles(dirPath).FirstOrDefault();
                        if(sourcefile != null)
                        {
                            string destinationFile = Path.Combine(dirPath, "0.jpg");
                            System.IO.File.Move(sourcefile, destinationFile);
                        }
                    }
                    
                    return "File deleted successfully.";
                }
                else
                {
                    return "File does not exist.";
                }
            }
            catch
            {
                throw;
            }

        }

       

        [Authorize]
        [HttpPost]
        [Route("api/UpdateUser")]
        public async Task<UserViewModel> UpdateUser([FromForm] User user,IFormFile? formFiles=null)
        {
            try
            {
                string path = _hostingEnvironment.ContentRootPath;
                return await _user.UpdateUser(user, formFiles,path);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        private JwtSecurityToken GetToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.TSecret));

            var token = new JwtSecurityToken(
                issuer: _appSettings.ValidIssuer,
                audience: _appSettings.ValidAudience,
                expires: DateTime.Now.AddYears(1),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }
    }
}
