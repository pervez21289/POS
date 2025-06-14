using Microsoft.AspNetCore.Mvc;

namespace LMS.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private   string[] Summaries = new[]
        {
        "Freezing", "Pervez", "Chilly", "Cool", "Mild", "Reshma", "Balmy", "Hot", "Imran", "Scorching"
    };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new[] {"Imran","Pervez1"};
        }                                 
    }
}