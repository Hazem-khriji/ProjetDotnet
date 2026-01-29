namespace ProjetDotnet.DTOs;

public class DashboardStatisticsDto
{
    public int TotalProperties { get; set; }
    public int ActiveProperties { get; set; }
    public int SoldProperties { get; set; }
    public int RentedProperties { get; set; }
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int PendingRequests { get; set; }
    public int TotalViews { get; set; }
    public decimal TotalValue { get; set; }
    
    public List<PropertyCountByCity> PropertiesByCity { get; set; }
    public List<PropertyCountByType> PropertiesByType { get; set; }
    //public List<PropertyCountByCategory> PropertiesByCategory { get; set; }
    public List<MonthlyStatistic> MonthlyStats { get; set; }
    //public List<RecentActivity> RecentActivities { get; set; }
}