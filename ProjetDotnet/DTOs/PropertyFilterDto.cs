namespace ProjetDotnet.DTOs;
using ProjetDotnet.Enums;
public class PropertyFilterDto : PaginationParams
{
    public string? SearchTerm { get; set; }
    public PropertyType? Type { get; set; }
    public PropertyStatus? Status { get; set; }
    public TransactionType? Transaction { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public double? MinArea { get; set; }
    public double? MaxArea { get; set; }
    public string? City { get; set; }
    public bool? IsFeatured { get; set; }
    public string SortBy { get; set; } = "price";
    public string SortOrder { get; set; } = "desc";
}