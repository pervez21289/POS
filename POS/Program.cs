
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using LMS.Repository.Repo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.SignalR;
using LMS.ChatHub;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:1302", "http://192.168.1.5:3000",
                                "http://localhost").AllowAnyHeader()
                                                  .AllowAnyMethod().AllowCredentials();
        });
});


// Add services to the container.
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserContext, UserContext>();
builder.Services.AddScoped<IUser, UserRepo>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IErrorLogger, ErrorLogger>();
builder.Services.AddScoped<ISaleRepository,SaleRepository>();
builder.Services.AddScoped<IUser, UserRepo>();
builder.Services.AddScoped<IBasicSettingRepository, BasicSettingRepository>();
builder.Services.AddSingleton<BaseRepository>();
builder.Services.AddSingleton<IApiLogQueue, ApiLogQueue>();
builder.Services.AddHostedService<ApiLogBackgroundService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var appSettingsSection = builder.Configuration.GetSection("AppSettings");
var appSettings = appSettingsSection.Get<AppSettings>();
builder.Services.AddSingleton(appSettings);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = appSettings.ValidAudience,
        ValidIssuer = appSettings.ValidIssuer,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettings.TSecret))
    };
});

builder.Services.AddSignalR();

var app = builder.Build();

BaseRepository.ConnectionString = app.Configuration.GetConnectionString("Value");
app.UseMiddleware<ActivityLoggingMiddleware>();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configure the HTTP request pipeline.
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions()
{
    FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "Files")),
    RequestPath = "/Files"
});

//app.UseForwardedHeaders(new ForwardedHeadersOptions
//{
//    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
//});


app.UseCors();
app.UseAuthentication();
//app.UseForwardedHeaders();
app.UseRouting();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<ChatHub>("/chathub");
});

app.MapControllers();
app.MapFallbackToFile("index.html");
app.Run();
