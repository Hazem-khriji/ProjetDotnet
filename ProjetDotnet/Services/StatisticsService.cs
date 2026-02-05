﻿namespace ProjetDotnet.Services;
using Microsoft.EntityFrameworkCore;
using ProjetDotnet.Data;
using ProjetDotnet.DTOs;
using ProjetDotnet.Models;
using ProjetDotnet.Enums;
using ProjetDotnet.Interfaces.Repository;
using ProjetDotnet.Interfaces.Services;

public class StatisticsService : IStatisticsService
    {
        private readonly ApplicationDbContext _context;

        public StatisticsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatisticsDto> GetDashboardStatisticsAsync()
        {
            var totalProperties = await _context.Properties.CountAsync();
            var activeProperties = await _context.Properties
                .CountAsync(p => p.Status == PropertyStatus.Available);
            var soldProperties = await _context.Properties
                .CountAsync(p => p.Status == PropertyStatus.Sold);
            var rentedProperties = await _context.Properties
                .CountAsync(p => p.Status == PropertyStatus.Rented);

            var totalUsers = await _context.Users.CountAsync();
            var activeUsers = await _context.Users.CountAsync(u => u.IsActive);

            var pendingRequests = await _context.Inquiries
                .CountAsync(r => r.Status == InquiryStatus.Pending);

            var totalViews = await _context.Properties.SumAsync(p => p.Inquiries.Count);
            var totalValue = await _context.Properties.SumAsync(p => p.Price);

            var propertiesByCity = await _context.Properties
                .Where(p => !string.IsNullOrEmpty(p.City))
                .GroupBy(p => p.City)
                .Select(g => new PropertyCountByCity
                {
                    City = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(x => x.Count)
                .Take(10)
                .ToListAsync();

            var propertiesByType = await _context.Properties
                .GroupBy(p => p.Type)
                .Select(g => new PropertyCountByType
                {
                    Type = g.Key.ToString(),
                    Count = g.Count()
                })
                .ToListAsync();

            var monthlyStats = await GetMonthlyStatsAsync();

            return new DashboardStatisticsDto
            {
                TotalProperties = totalProperties,
                ActiveProperties = activeProperties,
                SoldProperties = soldProperties,
                RentedProperties = rentedProperties,
                TotalUsers = totalUsers,
                ActiveUsers = activeUsers,
                PendingRequests = pendingRequests,
                TotalViews = totalViews,
                TotalValue = totalValue,
                PropertiesByCity = propertiesByCity,
                PropertiesByType = propertiesByType,
                MonthlyStats = monthlyStats
            };
        }

        private async Task<List<MonthlyStatistic>> GetMonthlyStatsAsync()
        {
            var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);
            
            var stats = await _context.Properties
                .Where(p => p.CreatedAt >= sixMonthsAgo)
                .GroupBy(p => new { p.CreatedAt.Year, p.CreatedAt.Month })
                .Select(g => new MonthlyStatistic
                {
                    Month = $"{g.Key.Year}-{g.Key.Month:D2}",
                    PropertiesAdded = g.Count(),
                    PropertiesSold = g.Count(p => p.Status == PropertyStatus.Sold),
                    TotalViews = g.Sum(p => p.ViewCount),
                    TotalValue = g.Sum(p => p.Price)
                })
                .OrderBy(s => s.Month)
                .ToListAsync();

            return stats;
        }

        public async Task<List<RecentActivityDto>> GetRecentActivitiesAsync(int count = 10)
        {
            var activities = new List<RecentActivityDto>();

            // Recent properties
            var recentProperties = await _context.Properties
                .Include(p => p.Owner)
                .OrderByDescending(p => p.CreatedAt)
                .Take(count / 2)
                .Select(p => new RecentActivityDto
                {
                    ActivityType = "Property Added",
                    Description = $"New property '{p.Title}' was added",
                    UserName = p.Owner != null ? p.Owner.FullName : "System",
                    CreatedAt = p.CreatedAt,
                    EntityType = "Property",
                    EntityId = p.Id
                })
                .ToListAsync();

            // Recent inquiries
            var recentInquiries = await _context.Inquiries
                .Include(i => i.User)
                .Include(i => i.Property)
                .OrderByDescending(i => i.RequestDate)
                .Take(count / 2)
                .Select(i => new RecentActivityDto
                {
                    ActivityType = "Inquiry Received",
                    Description = $"New inquiry for '{i.Property.Title}'",
                    UserName = i.User.FullName,
                    CreatedAt = i.RequestDate,
                    EntityType = "Inquiry",
                    EntityId = i.Id
                })
                .ToListAsync();

            activities.AddRange(recentProperties);
            activities.AddRange(recentInquiries);

            return activities.OrderByDescending(a => a.CreatedAt).Take(count).ToList();
        }
    }