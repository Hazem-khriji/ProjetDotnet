using Microsoft.AspNetCore.Identity;
using ProjetDotnet.Data;
using ProjetDotnet.Models;

namespace ProjetDotnet.Services;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        if (!context.Properties.Any())
        {
            var agent1 = new ApplicationUser
            {
                UserName = "agent1@realestate.com",
                Email = "agent1@realestate.com",
                FirstName = "John",
                LastName = "Agent",
                EmailConfirmed = true,
                IsActive = true,
                PhoneNumber = "+1-555-0101"
            };

            var agent2 = new ApplicationUser
            {
                UserName = "agent2@realestate.com",
                Email = "agent2@realestate.com",
                FirstName = "Sarah",
                LastName = "Johnson",
                EmailConfirmed = true,
                IsActive = true,
                PhoneNumber = "+1-555-0102"
            };

            await userManager.CreateAsync(agent1, "Agent123!");
            await userManager.CreateAsync(agent2, "Agent123!");
            await userManager.AddToRoleAsync(agent1, "Agent");
            await userManager.AddToRoleAsync(agent2, "Agent");


            var client1 = new ApplicationUser
            {
                UserName = "client1@email.com",
                Email = "client1@email.com",
                FirstName = "Mike",
                LastName = "Wilson",
                EmailConfirmed = true,
                IsActive = true,
                PhoneNumber = "+1-555-0201"
            };

            await userManager.CreateAsync(client1, "Client123!");
            await userManager.AddToRoleAsync(client1, "Client");
            await context.SaveChangesAsync();
        }
    }
}
