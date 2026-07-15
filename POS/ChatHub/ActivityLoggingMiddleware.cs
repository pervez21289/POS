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

        public async Task InvokeAsync(HttpContext context, IBackgroundJobQueue jobQueue)
        {
            var sw = Stopwatch.StartNew();

            try
            {
                await _next(context);
            }
            finally
            {
                sw.Stop();

                var ipAddress = context.Request.Headers["CF-Connecting-IP"].FirstOrDefault()
                    ?? context.Connection.RemoteIpAddress?.ToString();

                var log = new ApiLogEntry
                {
                    Timestamp = DateTime.UtcNow,
                    Path = context.Request.Path,
                    Method = context.Request.Method,
                    IpAddress = ipAddress,
                    StatusCode = context.Response.StatusCode,
                    DurationMs = sw.ElapsedMilliseconds,
                    UserId = Convert.ToInt64(context.User.FindFirst(ClaimTypes.Name)?.Value ?? "0")
                };

                await jobQueue.EnqueueAsync(new BackgroundJob
                {
                    JobType = BackgroundJobType.ApiLog,
                    Payload = log
                });
            }
        }
    }
}
