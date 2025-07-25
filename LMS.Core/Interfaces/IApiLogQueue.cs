
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;
using LMS.Core.Entities;
using Microsoft.AspNetCore.Http;

namespace LMS.Core.Interfaces
{
    public interface IApiLogQueue
    {
        void Enqueue(ApiLogEntry logEntry);
        bool TryDequeue(out ApiLogEntry logEntry);
    }

}
