using LMS.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Controllers
{
    
    [ApiController]
    public class DownloadController : ControllerBase
    {
        [HttpGet]
        [Route("api/Download")]
        public async Task<string> GetInstaInfor()
        {
          string data=string.Empty;
          HttpClient client = new HttpClient();
          HttpResponseMessage res=   await  client.GetAsync("https://www.instagram.com/p/DEEpz6esW-S/?__a=1&__d=dis");
            if (res.IsSuccessStatusCode) {
               data=    res.Content.ReadAsStringAsync().Result;
            }
            return data;
        }
    }
}
