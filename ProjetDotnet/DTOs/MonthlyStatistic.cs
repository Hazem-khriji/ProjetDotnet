namespace ProjetDotnet.DTOs;

public class MonthlyStatistic
{
    public string Month { get; set; } = string.Empty;
    public int PropertiesAdded { get; set; }
    public int PropertiesSold { get; set; }
    public int TotalViews { get; set; }
    public decimal TotalValue { get; set; }
}
