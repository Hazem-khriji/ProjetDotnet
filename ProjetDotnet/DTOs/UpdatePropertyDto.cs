namespace ProjetDotnet.DTOs;
using ProjetDotnet.Enums;
using System.ComponentModel.DataAnnotations;

public class UpdatePropertyDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
        
    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;
        
    [Required]
    [Range(0, double.MaxValue)]
    public int Price { get; set; }
        
    [Required]
    public PropertyType Type { get; set; }
        
    [Required]
    public PropertyStatus Status { get; set; }
        
    [Required]
    public string Address { get; set; } = string.Empty;
        
    [Required]
    [Range(1, 10000)]
    public double Area { get; set; }
        
    public int? YearBuilt { get; set; }
    public bool IsFeatured { get; set; }
}