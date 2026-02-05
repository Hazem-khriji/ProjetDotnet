using ProjetDotnet.DTOs;

namespace ProjetDotnet.ViewModels;

public class DashboardViewModel
{
    public DashboardStatisticsDto Statistics { get; set; } = new();
    public List<RecentActivityDto> RecentActivities { get; set; } = new();
    public List<PropertyDto> FeaturedProperties { get; set; } = new();
    public List<UserDto> RecentUsers { get; set; } = new();
}
