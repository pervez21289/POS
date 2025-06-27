using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;


[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly IUser _accountService;

    public AccountController(IUser accountService)
    {
        _accountService = accountService;
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
        var user = await _accountService.LoginAsync(request.Email, request.Password);

        if (user == null)
            return Unauthorized(new { Success = false, Message = "Invalid email or password" });

        return Ok(new { Success = true, Data = user });
    }
}
