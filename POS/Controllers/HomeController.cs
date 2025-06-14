using LMS.Core.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Controllers
{
    public class HomeController : Controller
    {
        public readonly AppSettings _appSettings;

        public HomeController(AppSettings appSettings)
        {
            _appSettings = appSettings;
        }

        [HttpGet("propertyforrent/{url}/{id}")]
        public IActionResult Index(string url,int id)
        {
           
            //var redirecturl = $"{Request.Headers["Referer"].ToString()}{Convert.ToString(url)}/{id}";

            string redirecturl = string.Format(_appSettings.RedirectUrl, url, id);
            return RedirectPermanent(redirecturl);
        }
    }
}
