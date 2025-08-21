using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using Microsoft.Extensions.Logging;

using Razorpay.Api;
using System.Data;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Text.Json;


namespace LMS.Repository.Repo
{
    public class SmtpEmailSender :BaseRepository, IEmailSender
    {
        private readonly ILogger<SmtpEmailSender> _logger;
        public readonly AppSettings _appSettings;
        public readonly ISubscriptionRepository _subscriptionRepository;
        private readonly RazorpayOptions _razorpay;
        public SmtpEmailSender(ILogger<SmtpEmailSender> logger, AppSettings appSettings, RazorpayOptions razorpay)
        {
            _logger = logger;
            _appSettings = appSettings;
            _razorpay = razorpay;
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

        public async Task<Result> SendResetPasswordEmail(string email, string resetToken)
        {
            // Load the HTML template
            var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", "ResetPasswordTemplate.html");
            string htmlContent = await File.ReadAllTextAsync(templatePath);
            var resetLink = $"{_appSettings.RedirectUrl}/reset-password?token={resetToken}";
            // Replace placeholders
            htmlContent = htmlContent.Replace("{{resetLink}}", resetLink)
                                     .Replace("{{year}}", DateTime.Now.Year.ToString());

            using (var message = new MailMessage())
            {
                message.From = new MailAddress(_appSettings.Email);
                message.To.Add(email); // TODO: Use user's email
                message.Subject = "Reset Your Password - NexBillPOS";
                message.IsBodyHtml = true;
                message.Body = htmlContent;


                using (var smtp = new SmtpClient("smtp.gmail.com", 587))
                {
                    smtp.Credentials = new NetworkCredential(_appSettings.Email, _appSettings.Secret);
                    smtp.EnableSsl = true;

                    await smtp.SendMailAsync(message);
                }

                return new Result() { IsSuccess = true, Message = "Password reset link sent successfully" };
            }
        }

        public async Task<Result> SentInvoiceDetails(int customerId)
        {
            // Load the HTML template
            var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", "SubscriptionConfirmation.html");
            string htmlContent = await File.ReadAllTextAsync(templatePath);
            SubscriptionPlan subscriptionPlan = await GetCurrentActivePlanAsync(customerId);
            var payment = await GetPaymentDetails(subscriptionPlan.PlanType);

            htmlContent = htmlContent.Replace("{{customerName}}", subscriptionPlan.CompanyName)
                   .Replace("{{planName}}", subscriptionPlan.PlanName)
                   .Replace("{{amount}}", Convert.ToString(subscriptionPlan.AmountPaid))
                   .Replace("{{invoiceNumber}}",Convert.ToString(subscriptionPlan.SubscriptionId))
                    .Replace("{{{invoiceNumber}}}", Convert.ToString(subscriptionPlan.SubscriptionId))
                   .Replace("{{invoiceUrl}}", "invoiceUrl")
                   .Replace("{{billingDate}}", subscriptionPlan.CreatedAt.ToString("dd/MMM/yyyy"))
                   .Replace("{{paymentMethod}}",Convert.ToString(payment["method"]))
                   .Replace("{{supportEmail}}", "info@nexbillpos")
                   .Replace("{{manageSubscriptionUrl}}", "https://nexbillpos.com/subscriptionplan")
                   .Replace("{{unsubscribeUrl}}", "unsubscribeUrl");

            byte[] pdfBytes = await GetIncvoicePDF(subscriptionPlan);


            using (var message = new MailMessage())
            {
                message.From = new MailAddress(_appSettings.Email);
                message.To.Add(subscriptionPlan.Email); // TODO: Use user's email
                message.Subject = "Reset Your Password - NexBillPOS";
                message.IsBodyHtml = true;
                message.Body = htmlContent;

                // Step 3: Attach PDF from memory (no need to save on disk)
                using var ms = new MemoryStream(pdfBytes);
                ms.Position = 0; // reset pointer
                message.Attachments.Add(new Attachment(ms, "invoice.pdf", "application/pdf"));


                using (var smtp = new SmtpClient("smtp.gmail.com", 587))
                {
                    smtp.Credentials = new NetworkCredential(_appSettings.Email, _appSettings.Secret);
                    smtp.EnableSsl = true;

                    await smtp.SendMailAsync(message);
                }

                return new Result() { IsSuccess = true, Message = "Password reset link sent successfully" };
            }
        }

        public async Task<Payment> GetPaymentDetails(string razorpay_payment_id)
        {
            RazorpayClient client = new RazorpayClient(_razorpay.KeyId, _razorpay.KeySecret);
            // Fetch all payments for the order
            Payment payment = client.Payment.Fetch(razorpay_payment_id);

            return payment;
        }

        public async Task<SubscriptionPlan> GetCurrentActivePlanAsync(int customerId)
        {
            var parameters = new { CustomerId = customerId };
            return await QueryFirstOrDefaultAsync<SubscriptionPlan>(
                "GetCurrentActivePlan",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }


        public async Task<byte[]> GetIncvoicePDF(SubscriptionPlan plan)
        {
            var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", "SubscriptionInvoice.html");
            string htmlContent = await File.ReadAllTextAsync(templatePath);
            // Replace placeholders with values
            string finalHtml = htmlContent
                .Replace("{{InvoiceNumber}}", plan.SubscriptionId.ToString())
                .Replace("{{InvoiceDate}}", plan.CreatedAt.ToString("dd-MMM-yyyy"))
                .Replace("{{PlanName}}", plan.PlanName)
                .Replace("{{BillingPeriod}}", plan.PlanStartDate.ToString("MMM yyyy") + "-" + plan.PlanStartDate.ToString("MMM yyyy"))
                .Replace("{{CustomerName}}", plan.CompanyName)
                .Replace("{{CustomerEmail}}",plan.Email)
                .Replace("{{Currency}}", "₹")
                .Replace("{{UnitPrice}}", plan.AmountPaid.ToString())
                .Replace("{{Subtotal}}", plan.AmountPaid.ToString())
                .Replace("{{TaxRate}}", "18")
                .Replace("{{TaxAmount}}", "89.82")
                .Replace("{{TotalAmount}}", plan.AmountPaid.ToString());


            using var httpClient = new HttpClient();
            string url = "http://myapp.local/api/PDF/generate";

            var payload = new
            {
                html = finalHtml
            };


            // Serialize as JSON
            string json = JsonSerializer.Serialize(payload);

            // Send as application/json
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await httpClient.PostAsync(url, content);

            byte[] pdfBytes = await response.Content.ReadAsByteArrayAsync();

            return pdfBytes;
        }
    }
}