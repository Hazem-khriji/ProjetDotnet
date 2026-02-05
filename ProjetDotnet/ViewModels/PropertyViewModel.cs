using System.ComponentModel.DataAnnotations;
using ProjetDotnet.DTOs;

namespace ProjetDotnet.ViewModels;

public class PropertyListViewModel
{
    public PagedResultDto<PropertyDto> Properties { get; set; } = new();
    public PropertyFilterDto Filter { get; set; } = new();
    public Dictionary<string, object> RouteValues { get; set; } = new();
}

public class PropertyCreateViewModel
{
    [Required]
    [Display(Name = "Title")]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Price")]
    [Range(0, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [Required]
    [Display(Name = "Description")]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Address")]
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;

    [Display(Name = "City")]
    [MaxLength(100)]
    public string? City { get; set; }

    [Required]
    [Display(Name = "Area")]
    [Range(0, double.MaxValue, ErrorMessage = "Area must be greater than 0")]
    public double Area { get; set; }

    [Display(Name = "Bedrooms")]
    [Range(0, 50, ErrorMessage = "Invalid number of bedrooms")]
    public int? Bedrooms { get; set; }

    [Display(Name = "Bathrooms")]
    [Range(0, 50, ErrorMessage = "Invalid number of bathrooms")]
    public int? Bathrooms { get; set; }

    [Display(Name = "Year Built")]
    [Range(1800, 2050, ErrorMessage = "Invalid year")]
    public int? YearBuilt { get; set; }

    [Display(Name = "Featured")]
    public bool IsFeatured { get; set; }

    [Required]
    [Display(Name = "Property Type")]
    public int Type { get; set; }

    [Required]
    [Display(Name = "Transaction Type")]
    public int Transaction { get; set; }

    [Display(Name = "Status")]
    public int Status { get; set; }

    [Display(Name = "Owner")]
    public string? OwnerId { get; set; }

    [Display(Name = "Property Images")]
    public List<IFormFile>? Images { get; set; }
}

public class PropertyEditViewModel : PropertyCreateViewModel
{
    public int Id { get; set; }
    public List<string>? ExistingImages { get; set; }
    public List<string>? ImagesToDelete { get; set; }
}
