﻿using Microsoft.AspNetCore.Identity;
using ProjetDotnet.Data;
using ProjetDotnet.Enums;
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

            var sampleProperties = new List<Property>
            {
                new Property
                {
                    Title = "Modern Downtown Apartment",
                    Description = "Stunning 2-bedroom apartment in the heart of downtown. Features modern amenities, city views, and walking distance to shops and restaurants.",
                    Price = 450000,
                    Type = PropertyType.Apartment,
                    Status = PropertyStatus.Available,
                    Transaction = TransactionType.Sale,
                    Address = "123 Main Street, Downtown, NY 10001",
                    City = "New York",
                    Area = 85.5,
                    Bedrooms = 2,
                    Bathrooms = 2,
                    YearBuilt = 2020,
                    IsFeatured = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    OwnerId = agent1.Id
                },
                new Property
                {
                    Title = "Luxury Family Villa",
                    Description = "Beautiful 4-bedroom villa with garden, pool, and garage. Perfect for families looking for space and comfort in a quiet neighborhood.",
                    Price = 750000,
                    Type = PropertyType.Villa,
                    Status = PropertyStatus.Available,
                    Transaction = TransactionType.Sale,
                    Address = "456 Oak Avenue, Suburbia, NY 10002",
                    City = "New York",
                    Area = 220.0,
                    Bedrooms = 4,
                    Bathrooms = 3,
                    YearBuilt = 2018,
                    IsFeatured = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-15),
                    OwnerId = agent2.Id
                },
                new Property
                {
                    Title = "Cozy Studio Apartment",
                    Description = "Perfect starter home or investment property. Well-maintained studio with modern appliances and great location.",
                    Price = 1800,
                    Type = PropertyType.Apartment,
                    Status = PropertyStatus.Available,
                    Transaction = TransactionType.Rent,
                    Address = "789 Pine Street, Midtown, NY 10003",
                    City = "New York",
                    Area = 45.0,
                    Bedrooms = 1,
                    Bathrooms = 1,
                    YearBuilt = 2015,
                    IsFeatured = false,
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    OwnerId = agent1.Id
                },
                new Property
                {
                    Title = "Commercial Office Space",
                    Description = "Prime commercial real estate in business district. Ideal for startups and small businesses. Includes parking.",
                    Price = 3500,
                    Type = PropertyType.Commercial,
                    Status = PropertyStatus.Available,
                    Transaction = TransactionType.Rent,
                    Address = "321 Business Blvd, Financial District, NY 10004",
                    City = "New York",
                    Area = 150.0,
                    Bedrooms = 0,
                    Bathrooms = 2,
                    YearBuilt = 2010,
                    IsFeatured = false,
                    CreatedAt = DateTime.UtcNow.AddDays(-7),
                    OwnerId = agent2.Id
                },
                new Property
                {
                    Title = "Spacious Family House",
                    Description = "Traditional 3-bedroom house with large backyard. Great for families with children. Recently renovated kitchen and bathrooms.",
                    Price = 525000,
                    Type = PropertyType.House,
                    Status = PropertyStatus.Sold,
                    Transaction = TransactionType.Sale,
                    Address = "654 Elm Street, Residential Area, NY 10005",
                    City = "New York",
                    Area = 180.0,
                    Bedrooms = 3,
                    Bathrooms = 2,
                    YearBuilt = 2005,
                    IsFeatured = false,
                    CreatedAt = DateTime.UtcNow.AddDays(-20),
                    OwnerId = agent1.Id
                }
            };

            context.Properties.AddRange(sampleProperties);
            await context.SaveChangesAsync();

            // Add sample images for properties
            var sampleImages = new List<PropertyImage>
            {
                // Images for Modern Downtown Apartment
                new PropertyImage
                {
                    PropertyId = sampleProperties[0].Id,
                    ImageUrl = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
                    IsPrimary = true,
                    DisplayOrder = 0,
                    UploadedAt = DateTime.UtcNow
                },
                new PropertyImage
                {
                    PropertyId = sampleProperties[0].Id,
                    ImageUrl = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
                    IsPrimary = false,
                    DisplayOrder = 1,
                    UploadedAt = DateTime.UtcNow
                },
                // Images for Luxury Family Villa
                new PropertyImage
                {
                    PropertyId = sampleProperties[1].Id,
                    ImageUrl = "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
                    IsPrimary = true,
                    DisplayOrder = 0,
                    UploadedAt = DateTime.UtcNow
                },
                new PropertyImage
                {
                    PropertyId = sampleProperties[1].Id,
                    ImageUrl = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
                    IsPrimary = false,
                    DisplayOrder = 1,
                    UploadedAt = DateTime.UtcNow
                },
                // Images for Cozy Studio Apartment
                new PropertyImage
                {
                    PropertyId = sampleProperties[2].Id,
                    ImageUrl = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
                    IsPrimary = true,
                    DisplayOrder = 0,
                    UploadedAt = DateTime.UtcNow
                },
                // Images for Commercial Office Space
                new PropertyImage
                {
                    PropertyId = sampleProperties[3].Id,
                    ImageUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
                    IsPrimary = true,
                    DisplayOrder = 0,
                    UploadedAt = DateTime.UtcNow
                },
                // Images for Spacious Family House
                new PropertyImage
                {
                    PropertyId = sampleProperties[4].Id,
                    ImageUrl = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
                    IsPrimary = true,
                    DisplayOrder = 0,
                    UploadedAt = DateTime.UtcNow
                },
                new PropertyImage
                {
                    PropertyId = sampleProperties[4].Id,
                    ImageUrl = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
                    IsPrimary = false,
                    DisplayOrder = 1,
                    UploadedAt = DateTime.UtcNow
                }
            };

            context.PropertyImages.AddRange(sampleImages);
            await context.SaveChangesAsync();

            // Add sample inquiries
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

            var sampleInquiries = new List<Inquiry>
            {
                new Inquiry
                {
                    PropertyId = sampleProperties[0].Id,
                    UserId = client1.Id,
                    Message = "I'm very interested in this apartment. Could we schedule a viewing this week?",
                    PhoneNumber = "+1-555-0201",
                    PreferredVisitDate = DateTime.UtcNow.AddDays(3),
                    Status = InquiryStatus.New,
                    RequestDate = DateTime.UtcNow.AddHours(-2)
                },
                new Inquiry
                {
                    PropertyId = sampleProperties[1].Id,
                    UserId = client1.Id,
                    Message = "This villa looks perfect for our family. What are the neighborhood schools like?",
                    PhoneNumber = "+1-555-0201",
                    Status = InquiryStatus.Contacted,
                    RequestDate = DateTime.UtcNow.AddDays(-1),
                    ResponseDate = DateTime.UtcNow.AddHours(-12),
                    AdminNotes = "Contacted client, scheduled viewing for tomorrow."
                }
            };

            context.Inquiries.AddRange(sampleInquiries);
            await context.SaveChangesAsync();
        }
    }
}
