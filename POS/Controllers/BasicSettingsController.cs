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

    [Route("api/[controller]")]
    [ApiController]
    public class BasicSettingsController : ControllerBase
    {
        private readonly IBasicSettingRepository _repo;

        public BasicSettingsController(IBasicSettingRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _repo.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id) => Ok(await _repo.GetByIdAsync(id));

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] BasicSetting setting)
        {
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
