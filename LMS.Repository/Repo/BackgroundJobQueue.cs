using Amazon.Runtime.Internal.Endpoints.StandardLibrary;
using Dapper;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Drawing.Imaging;
using System.Net;
using System.Net.Mail;
using System.Reflection;
using System.Reflection.Metadata;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Repo.Repository
{
    public class BackgroundJobQueue : IBackgroundJobQueue
    {
        private readonly ConcurrentQueue<BackgroundJob> _jobs = new();

        public void Enqueue(BackgroundJob job)
        {
            if (job == null)
                throw new ArgumentNullException(nameof(job));

            _jobs.Enqueue(job);
        }

        public bool TryDequeue(out BackgroundJob job)
        {
            return _jobs.TryDequeue(out job!);
        }
    }

}
