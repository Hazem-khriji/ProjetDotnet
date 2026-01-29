namespace ProjetDotnet.DTOs;

public class StatisticsDto
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
        
    public List<PropertyCountByCity> PropertiesByCity { get; set; } = new();
    public List<PropertyCountByType> PropertiesByType { get; set; } = new();
    public List<MonthlyStatistic> MonthlyStats { get; set; } = new();
}
    
public class PropertyCountByCity
{
    public string City { get; set; } = string.Empty;
    public int Count { get; set; }
}
    
public class PropertyCountByType
{
    public string Type { get; set; } = string.Empty;
    public int Count { get; set; }
}
    
public class MonthlyStatistic
{
    public string Month { get; set; } = string.Empty;
    public int PropertiesAdded { get; set; }
    public int PropertiesSold { get; set; }
    public int TotalViews { get; set; }
}
