﻿namespace ProjetDotnet.Interfaces.Services;
using ProjetDotnet.DTOs;

public interface IStatisticsService
{
    Task<DashboardStatisticsDto> GetDashboardStatisticsAsync();
    Task<List<RecentActivityDto>> GetRecentActivitiesAsync(int count = 10);
}