using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repository.Repo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Mvc;
using Razorpay.Api;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
namespace LMS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        protected readonly IUserContext _userContext;
        protected readonly ISubscriptionRepository _repo;
        private readonly IErrorLogger _logger;
        protected string k_Id= "rzp_test_ZSfW1efmHkQHZc";
        protected string k_Secret= "f27N2MF4q0Vmbwp4aTT9s2JC";
        
        public PaymentController( IUserContext userContext, ISubscriptionRepository repo,IErrorLogger errorLogger)
        {
            _userContext = userContext;
            _repo = repo;
            _logger = errorLogger;  
        }



        [HttpPost("create-order")]
        public IActionResult CreateOrder([FromBody] PaymentRequest request)
        {
            RazorpayClient client = new RazorpayClient(k_Id, k_Secret);

            Dictionary<string, object> options = new Dictionary<string, object>();
            options.Add("amount", request.Amount * 100); // Razorpay works with paise
            options.Add("currency", "INR");
            options.Add("receipt", "order_" + _userContext.CompanyID.ToString()+DateTime.Now.ToString("ddmmyy"));
            options.Add("notes", new Dictionary<string, string> {
                                            { "customer_id",Convert.ToString(_userContext.CompanyID) },
                                            { "plan_name", request.Plan }
                    });

            Order order = client.Order.Create(options);
            if (order == null || order["id"] == null)
            {
                return BadRequest(new { message = "Failed to create order" });
            }

            string orderId = Convert.ToString(order["id"]);
            string amount = Convert.ToString(order["amount"]);
            string currency = Convert.ToString(order["currency"]);

            return Ok(new
            {
                orderId = orderId,
                amount = amount,
                currency = currency,
                key= k_Id
            });
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyPayment([FromBody] PaymentVerificationRequest request)
        {
            try
            {
                string generatedSignature;

                string payload = $"{request.razorpay_order_id}|{request.razorpay_payment_id}";

                using (HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(k_Secret)))
                {
                    byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
                    generatedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();
                }

                if (generatedSignature == request.razorpay_signature)
                {
                    RazorpayClient client = new RazorpayClient(k_Id, k_Secret);
                    var order = client.Order.Fetch(request.razorpay_order_id);

                    string customerId = order["notes"]["customer_id"];
                    string planName = order["notes"]["plan_name"];
                    string currency = order["currency"];
                    string receipt = order["receipt"];
                    decimal amount = Convert.ToDecimal(order["amount"]);

                    SubscriptionPlan subscription = new SubscriptionPlan
                    {
                        CustomerId = Convert.ToInt32(customerId),
                        PlanName = planName,
                        PlanType = request.razorpay_payment_id,
                        AmountPaid = amount, 
                        Currency = "INR",
                        RazorpayOrderId = request.razorpay_order_id,
                        RazorpayPaymentId = request.razorpay_payment_id,
                        PaymentStatus = "Success",
                        PlanStartDate = DateTime.UtcNow,
                        PlanEndDate = DateTime.UtcNow.AddMonths(1), 
                        CreatedAt = DateTime.UtcNow
                    };
                    await _repo.InsertSubscriptionAsync(subscription);
                    return Ok(new { status = "Payment Verified" });
                }
                return BadRequest(new { status = "Payment Verification Failed" });
            }
            catch (Exception ex)
            {
                // Log the exception (ex) as needed
                _logger.Log(ex);
                return BadRequest(new { status = "Payment Verification Failed" });
            }

            
        }

        [HttpGet("SubscribeFreePlan")]
        public async Task<IActionResult> SubscribeFreePlan()
        {
            try
            {

                SubscriptionPlan subscription = new SubscriptionPlan
                {
                    CustomerId = _userContext.CompanyID,
                    PlanName = "Free",
                    PlanType = "Free",
                    AmountPaid = 0, // You can set the actual amount here
                    Currency = "INR",
                    RazorpayOrderId = "NA",
                    RazorpayPaymentId = "NA",
                    PaymentStatus = "Success",
                    PlanStartDate = DateTime.UtcNow,
                    PlanEndDate = DateTime.UtcNow.AddMonths(1), // Assuming a 1-month plan
                    CreatedAt = DateTime.UtcNow
                };
                await _repo.InsertSubscriptionAsync(subscription);
                return Ok(new { status = "Payment Verified" });
            }
            catch (Exception ex)
            {
                // Log the exception (ex) as needed
            }   

            return BadRequest(new { status = "Payment Verification Failed" });
        }


        [HttpGet("GetCurrentActivePlan")]
        public async Task<IActionResult> GetCurrentActivePlan()
        {
            var plan = await _repo.GetCurrentActivePlanAsync(_userContext.CompanyID);
            if(plan==null)
            {
                plan= new SubscriptionPlan() { PlanStatus = "InActive" };
            }
            return Ok(plan);
        }

    }

    public class PaymentVerificationRequest
    {
        public string razorpay_order_id { get; set; }
        public string razorpay_payment_id { get; set; }
        public string razorpay_signature { get; set; }
     
    }


    public class PaymentRequest
    {
        public int Amount { get; set; }
        public string Plan { get; set; }
        
    }

}