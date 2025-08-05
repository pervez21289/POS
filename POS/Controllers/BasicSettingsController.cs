using Amazon.Runtime.Internal;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repository.Repo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Drawing;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LMS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BasicSettingsController : ControllerBase
    {
        private readonly IBasicSettingRepository _repo;
        private IUserContext _userContext;

        public BasicSettingsController(IBasicSettingRepository repo,IUserContext userContext)
        {
            _repo = repo;
            _userContext = userContext;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _repo.GetByIdAsync(0, _userContext.CompanyID));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
                                                               
                return Ok(await _repo.GetByIdAsync(id,_userContext.CompanyID));
        }
       

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] BasicSetting setting)
        {
            setting.CompanyID = _userContext.CompanyID;
            await _repo.InsertAsync(setting);
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromBody] BasicSetting setting)
        {
            await _repo.UpdateAsync(setting);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _repo.DeleteAsync(id);
            return Ok();
        }
    }
}
