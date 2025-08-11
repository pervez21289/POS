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
                    new Claim(ClaimTypes.Name, Convert.ToString(userData.UserID)),
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
                    mobile = userData.Mobile,
                    menus = userData.menuItemDtos,
                    name=userData.FirstName,
                    Role = userData.RoleNames,
                    plan=userData.SubscriptionJson,
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

    [HttpPost]
    [Route("ValidateOTP")]
    public async Task<IActionResult> ValidateOTP(User user)
    {
        try
        {
            if (await _accountService.ValidateOTP(user))
            {
                return Ok(new { Success = true, Message = "OTP validated successfully" });
            }
            else
            {
                return BadRequest(new { Success = false, Message = "Invalid OTP" });
            }
        }
        catch (Exception)
        {
            return BadRequest(new { Success = false, Message = "Invalid OTP" });
        }
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _accountService.ForgotPasswordAsync(request.Email);
            if (result)
            {
                return Ok(new { Success = true, Message = "Password reset email sent successfully." });
            }
            return BadRequest(new { Success = false, Message = "Failed to send password reset email." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error occurred", Error = ex.Message });
        }
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            var result = await _accountService.ResetPasswordAsync(request.Token, request.NewPassword);
            if (result)
            {
                return Ok(new { Success = true, Message = "Password reset successfully." });
            }
            return BadRequest(new { Success = false, Message = "Failed to reset password." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error occurred", Error = ex.Message });
        }
    }

    private JwtSecurityToken GetToken(List<Claim> authClaims)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.TSecret));

        var token = new JwtSecurityToken(
            issuer: _appSettings.ValidIssuer,
            audience: _appSettings.ValidAudience,
            expires: DateTime.Now.AddYears(3),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

        return token;
    }
}
