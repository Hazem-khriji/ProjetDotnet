namespace ProjetDotnet.Interfaces.Services;

public interface IStatisticsService
{
    Task<DashboardStatisticsDto> GetDashboardStatisticsAsync();
    Task<List<MonthlyStatistic>> GetMonthlyStatsAsync(int months = 12);
    Task<List<PropertyCountByCity>> GetPropertiesByCityAsync();
    Task<List<RecentActivity>> GetRecentActivitiesAsync(int count = 10);
}