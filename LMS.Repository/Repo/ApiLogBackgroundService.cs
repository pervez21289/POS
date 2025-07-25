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
        private readonly IApiLogQueue _logQueue;
        private readonly BaseRepository _repository;
        private readonly ILogger<ApiLogBackgroundService> _logger;

        public ApiLogBackgroundService(IApiLogQueue logQueue, BaseRepository repository, ILogger<ApiLogBackgroundService> logger)
        {
            _logQueue = logQueue;
            _repository = repository;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                if (_logQueue.TryDequeue(out var logEntry))
                {
                    try
                    {
                        const string sql = @"
                        INSERT INTO ApiLogs (Timestamp, Path, Method, IpAddress, StatusCode, DurationMs,UserId)
                        VALUES (@Timestamp, @Path, @Method, @IpAddress, @StatusCode, @DurationMs,@UserId)";

                        await _repository.ExecuteAsync(sql, logEntry, CommandType.Text);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to insert API log");
                    }
                }
                else
                {
                    await Task.Delay(1000, stoppingToken); // CPU-friendly wait
                }
            }
        }
    }



}
