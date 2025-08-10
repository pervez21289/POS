
using LMS.Core.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Data;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Interfaces
{
    public interface ISubscriptionRepository
    {
        Task<bool> InsertSubscriptionAsync(SubscriptionPlan subscription);
        Task<SubscriptionPlan> GetCurrentActivePlanAsync(int customerId);
    }
}
