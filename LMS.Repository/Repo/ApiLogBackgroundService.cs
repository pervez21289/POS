using Amazon.Runtime.Internal.Endpoints.StandardLibrary;
using Dapper;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
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
    public class ApiLogBackgroundService : BackgroundService
    {
        private readonly IBackgroundJobQueue _jobQueue;
        private readonly BaseRepository _repository;
        private readonly ILogger<ApiLogBackgroundService> _logger;
        private readonly IEmailSender _emailSender; // Your email sending helper/service

        public ApiLogBackgroundService(
            IBackgroundJobQueue jobQueue,
            BaseRepository repository,
            ILogger<ApiLogBackgroundService> logger,
            IEmailSender emailSender)
        {
            _jobQueue = jobQueue;
            _repository = repository;
            _logger = logger;
            _emailSender = emailSender;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                if (_jobQueue.TryDequeue(out var job))
                {
                    try
                    {
                        switch (job.JobType)
                        {
                            case BackgroundJobType.ApiLog:
                                var logEntry = (ApiLogEntry)job.Payload;
                                const string sql = @"
                                INSERT INTO ApiLogs (Timestamp, Path, Method, IpAddress, StatusCode, DurationMs, UserId)
                                VALUES (@Timestamp, @Path, @Method, @IpAddress, @StatusCode, @DurationMs, @UserId)";
                                await _repository.ExecuteAsync(sql, logEntry, CommandType.Text);
                                break;

                            case BackgroundJobType.SendEmail:
                                var emailData = ((string Email, string Otp))job.Payload;
                                await _emailSender.SentOTPSync(emailData.Email, emailData.Otp);
                                break;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Error processing {job.JobType} job");
                    }
                }
                else
                {
                    await Task.Delay(1000, stoppingToken);
                }
            }
        }
    }




}
