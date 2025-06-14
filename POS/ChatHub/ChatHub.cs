using Microsoft.AspNetCore.SignalR;

namespace LMS.ChatHub
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(int user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
