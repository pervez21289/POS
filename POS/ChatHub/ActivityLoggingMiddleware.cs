using LMS.Core.Entities;
using LMS.Core.Interfaces;
using System.Diagnostics;
using System.Security.Claims;

namespace LMS.ChatHub
{
    public class ActivityLoggingMiddleware
    {
        private readonly RequestDelegate _next;
      
        public ActivityLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IApiLogQueue logQueue)
        {
            var sw = Stopwatch.StartNew();
           
            try
            {
                await _next(context);
            }
            finally
            {
                sw.Stop();

                var log = new ApiLogEntry
                {
                    Timestamp = DateTime.UtcNow,
                    Path = context.Request.Path,
                    Method = context.Request.Method,
                    IpAddress = context.Connection.RemoteIpAddress?.ToString(),
                    StatusCode = context.Response.StatusCode,
                    DurationMs = sw.ElapsedMilliseconds,
                    UserId= Convert.ToInt64(context.User.FindFirst(ClaimTypes.Name)?.Value)
                };

                logQueue.Enqueue(log);
            }
        }
    }


}
