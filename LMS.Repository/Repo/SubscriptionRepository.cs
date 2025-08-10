using Dapper;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
namespace LMS.Repository.Repo
{
    public class SubscriptionRepository :BaseRepository, ISubscriptionRepository
    {
        private readonly IConfiguration _configuration;

        public SubscriptionRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> InsertSubscriptionAsync(SubscriptionPlan subscription)
        {

            var parameters = new
            {
                CustomerId = subscription.CustomerId,
                PlanName = subscription.PlanName,
                PlanType = subscription.PlanType,
                AmountPaid = subscription.AmountPaid,
                Currency = subscription.Currency,
                RazorpayOrderId = subscription.RazorpayOrderId,
                RazorpayPaymentId = subscription.RazorpayPaymentId,
                PaymentStatus = subscription.PaymentStatus,
                PlanStartDate = subscription.PlanStartDate,
                PlanEndDate = subscription.PlanEndDate
            };

            var result = await ExecuteAsync("InsertSubscription", parameters, commandType: CommandType.StoredProcedure);

            return result > 0;
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
    }
}
