using LMS.Core.Interfaces;
using LMS.Repository.Utilities;
using System;
using System.IO;
using System.Text.Json;
using System.Text.Json.Nodes;

public class Program
{
    public static void Main()
    {
        Console.Write("Enter Razorpay KeyId: ");
        string keyId = Console.ReadLine();

        Console.Write("Enter Razorpay Secret: ");
        string keySecret = ReadSecretFromConsole();

        string secret = $"{keyId}:{keySecret}";

        var masterKey = Environment.GetEnvironmentVariable("App_MasterKey");
        if (string.IsNullOrEmpty(masterKey))
        {
            Console.WriteLine("❌ App_MasterKey not found in environment variables!");
            return;
        }

        IHelper helper = new Helper();
        string encrypted = helper.Encrypt(secret, masterKey);

        Console.WriteLine("✅ Encrypted Value: " + encrypted);

      
    }

    private static string ReadSecretFromConsole()
    {
        var secret = string.Empty;
        ConsoleKey key;

        do
        {
            var keyInfo = Console.ReadKey(intercept: true);
            key = keyInfo.Key;

            if (key == ConsoleKey.Backspace && secret.Length > 0)
            {
                secret = secret.Substring(0, secret.Length - 1);
                Console.Write("\b \b");
            }
            else if (!char.IsControl(keyInfo.KeyChar))
            {
                secret += keyInfo.KeyChar;
                Console.Write("*");
            }
        } while (key != ConsoleKey.Enter);

        Console.WriteLine();
        return secret;
    }
}
