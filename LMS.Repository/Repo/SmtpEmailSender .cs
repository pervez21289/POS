using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Mail;
namespace LMS.Repository.Repo
{
    public class SmtpEmailSender : IEmailSender
    {
        private readonly ILogger<SmtpEmailSender> _logger;
        public readonly AppSettings _appSettings;
        public SmtpEmailSender(ILogger<SmtpEmailSender> logger, AppSettings appSettings)
        {
            _logger = logger;
            _appSettings = appSettings;
        }

        public async Task SendEmailAsync(string toEmail, string otp)
        {
            try
            {
                using var smtp = new SmtpClient("smtp.yourserver.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential("username", "password"),
                    EnableSsl = true
                };

                var mail = new MailMessage("no-reply@yourdomain.com", toEmail)
                {
                    Subject = "Your OTP Code",
                    Body = $"Your OTP is: {otp}",
                    IsBodyHtml = false
                };

                await smtp.SendMailAsync(mail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send OTP email to {Email}", toEmail);
                throw; // Let background service catch and log again if needed
            }
        }

        public async Task<Result> SentOTPSync(string email, string OTP)
        {
            try
            {
                MailMessage message = new MailMessage();
                message.From = new MailAddress("aliusman9760@gmail.com");
                message.To.Add(email);
                message.Subject = "OTP Verification #";
                message.IsBodyHtml = true;
                message.Body = "<div>" + OTP + "</div>";

                SmtpClient client = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential(_appSettings.Email, _appSettings.Secret),
                    EnableSsl = true
                };


                await client.SendMailAsync(message);


                return new Result() { IsSuccess = true, Message = "Email sent successfully" };
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}