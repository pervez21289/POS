using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Razorpay.Api;
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

            if (result.Success)
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
                return Ok(userData);
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
            LoginResponse response = await _accountService.ValidateOTP(user);
            if (response!=null)
            {
                return Ok(response);
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

    
}
