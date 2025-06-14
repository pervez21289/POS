using System;
using System.Collections.Generic;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;

using LMS.Core.Entities;
using LMS.Core.Interfaces;
using System.Reflection;
using Microsoft.AspNetCore.Http;
using System.Drawing.Imaging;
using System.Drawing;
using Amazon.Runtime.Internal.Endpoints.StandardLibrary;

namespace LMS.Repo.Repository
{
    public class UserRepo : BaseRepository, IUser
    {
        public readonly AppSettings _appSettings;
        public UserRepo(AppSettings appSettings)
        {
            _appSettings = appSettings;
        }
        public async Task<IEnumerable<UserViewModel>> GetUsers()
        {
            return await Query<UserViewModel>("SP_GetUsers");
        }

        public async Task<string> GetUser(long UserId)
        {
            return await QueryFirstOrDefaultAsync<string>("SP_GetUser", new {UserId=UserId});
        }

        public async Task<IEnumerable<Role>> GetRoles()
        {
            try
            {
                return await Query<Role>("SP_GetRoles");
            }
            catch (Exception)
            {
                throw;
            }
        }



        public async Task<Result> SaveUser(User user)
        {
            UserResult result = await QueryFirstOrDefaultAsync<UserResult>("SP_SaveUser", new { UserId = 0, Mobile = user.Mobile });
            Task<Result> taskEmail = SentEmail(result.OTP);
            Task taskSMS = SendSMS(result.OTP,user.Mobile);
            await Task.WhenAll(taskSMS,taskEmail);
            return taskEmail.Result;
        }                      

        public async Task<Result> SaveMessage(Messages message)
        {
            UserResult result = await QueryFirstOrDefaultAsync<UserResult>("SP_SaveMessage", new {SentTo=message.SentTo, UserId = message.UserId, Message = message.Message });
            return result;
        }

        public async Task<string> GetMessages(long UserId)
        {
            string result = await QueryFirstOrDefaultAsync<string>("SP_GetMessage", new { UserId = UserId });
            return result;
        }

        public async Task<UserViewModel> UpdateUser(User user, IFormFile formFile, string ServerPath)
        {
            var userData = new
            {
                UserId = user.UserId,
                Name = user.Name,
                Password = user.Password,
                Email = user.Email,
                Mobile = user.Mobile,
                CityId=user.CityId
            };
            Task<UserViewModel> updateUser =  QueryFirstOrDefaultAsync<UserViewModel>("SP_SaveUser",  userData );
            Task saveFile = Task.CompletedTask;

            if(formFile!=null)
             saveFile=SaveFiles(formFile, user.UserId, user.Mobile, ServerPath);

            Task sendUpdate = SentUpdate(user);
            await Task.WhenAll(updateUser,saveFile, sendUpdate);
            return updateUser.Result;
        }

        public async Task<Result> SentEmail(string OTP)
        {
            try
            {
                MailMessage message = new MailMessage();
                message.From = new MailAddress("aliusman9760@gmail.com");
                message.To.Add("pervez21289@gmail.com");
                message.Subject = "OTP Verification #";
                message.IsBodyHtml = true;
                message.Body = "<div>" + OTP + "</div>";

                SmtpClient client = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential(_appSettings.Email, _appSettings.Secret),
                    EnableSsl = true
                };


                client.SendAsync(message, null);


                return new Result() { IsSuccess = true, Message = "Email sent successfully" };
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task SendSMS(string OTP,string Mobile)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    string url = string.Format("https://www.fast2sms.com/dev/bulkV2?authorization={0}&route=otp&variables_values={1}&flash=0&numbers={2}", "Qx7ZkSVpfemUTbNuJ9Hrh2LXPn3OF1cW0gDtjodGEsi4az8MCYPvrS4fYJ7kslEnaAFLTm0ZXcqg6oGN", OTP, Mobile);
                    HttpResponseMessage response = await client.GetAsync(url);
                }

            }
            catch
            {

            }
        }
        public async Task<Result> SentUpdate(User user)
        {
            try
            {
                MailMessage message = new MailMessage();
                message.From = new MailAddress("aliusman9760@gmail.com");
                message.To.Add(user.Email);
                message.Subject = "!Important Profile Update";
                message.IsBodyHtml = true;
                message.Body = "<div>Profile updated successfully!</div>";

                SmtpClient client = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential(_appSettings.Email, _appSettings.Secret),
                    EnableSsl = true
                };


                client.SendAsync(message, null);


                return new Result() { IsSuccess = true, Message = "Email sent successfully" };
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<UserViewModel> Login(User user)
        {
            try
            {
                return await QueryFirstOrDefaultAsync<UserViewModel>("SP_LoginUser", new { UserName = user.Email, Password = user.Password });
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Result> PasswordReset(User user)
        {
            try
            {
                return await QueryFirstOrDefaultAsync<Result>("SP_SavePassword", new { Password = user.Password, Token = user.OTP });
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<UserViewModel> ValidateOTP(User user)
        {
            try
            {
                return await QueryFirstOrDefaultAsync<UserViewModel>("SP_ValidateOTP", new { Mobile = user.Mobile, OTP = user.OTP });
            }
            catch (Exception)
            {
                throw;
            }
        }

       
        #region Common Methods
        public async Task SaveFiles(IFormFile file, long? Id, string fileId,string filepath)
        {

            filepath = Path.Combine(filepath, "Files", "Profile");
            using (Bitmap postedImage = new Bitmap(file.OpenReadStream()))
            {

                try
                {
                    if (!Directory.Exists(filepath))
                        Directory.CreateDirectory(filepath);


                    filepath = Path.Combine(filepath, fileId + ".jpg");
                    ImageCodecInfo myImageCodecInfo;
                    System.Drawing.Imaging.Encoder myEncoder;
                    EncoderParameter myEncoderParameter;
                    EncoderParameters myEncoderParameters;
                    myImageCodecInfo = GetEncoderInfo("image/jpeg");
                    myEncoder = System.Drawing.Imaging.Encoder.Quality;
                    myEncoderParameters = new EncoderParameters(1);
                    myEncoderParameter = new EncoderParameter(myEncoder, 20L);
                    myEncoderParameters.Param[0] = myEncoderParameter;
                    using (MemoryStream memoryStream = new MemoryStream())
                    {
                        postedImage.Save(memoryStream, myImageCodecInfo, myEncoderParameters);
                        byte[] data = memoryStream.ToArray();
                        await System.IO.File.WriteAllBytesAsync(filepath, data);

                    }

                }
                catch (Exception ex)
                {
                    throw;
                }
            }

        }
        private static ImageCodecInfo GetEncoderInfo(String mimeType)
        {
            int j;
            ImageCodecInfo[] encoders;
            encoders = ImageCodecInfo.GetImageEncoders();
            for (j = 0; j < encoders.Length; ++j)
            {
                if (encoders[j].MimeType == mimeType)
                    return encoders[j];
            }
            return null;
        }

        #endregion
    }
}
