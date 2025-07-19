using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;
using System.Text;


[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{

    public readonly AppSettings _appSettings;
    public IUser _accountService;
    public AccountController(IUser accountService, AppSettings appSettings)
    {
        _accountService = accountService;
        _appSettings = appSettings;
    }


    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            CreateUserResult result = await _accountService.RegisterCompanyWithAdminAsync(request);

            if (result.Success == 1)
                return Ok(result);
            else
                return BadRequest(result.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error occurred", Error = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var userData = await _accountService.LoginAsync(request.Email, request.Password);
            if (userData != null)
            {
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, Convert.ToString(request.Email)),
                    new Claim(ClaimTypes.Role, Convert.ToString(userData.RoleNames)),
                    new Claim(ClaimTypes.NameIdentifier, Convert.ToString(userData.CompanyID)),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                authClaims.Add(new Claim(ClaimTypes.Role, userData.RoleNames));
                var token = GetToken(authClaims);

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo,
                    email = request.Email,
                    menus = userData.menuItemDtos,
                    success = true
                });
            }
            return Unauthorized(new { Success = false, Message = "Invalid email or password" });
        }
        catch (Exception ex)
        {
            // Log the exception (you can use a logging framework here)
            // For example: _logger.Log(ex);
            return StatusCode(500, new { Message = "Error occurred", Error = ex.Message });
        }



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
