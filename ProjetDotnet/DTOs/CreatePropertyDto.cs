namespace ProjetDotnet.DTOs;
using System.ComponentModel.DataAnnotations;

using ProjetDotnet.Enums;
public class CreatePropertyDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; }
    
    [Required]
    [MaxLength(2000)]
    public string Description { get; set; }
    
    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }
    
    [Required]
    public PropertyType Type { get; set; }
    
    [Required]
    public string Address { get; set; }
    
    [Required]
    [Range(1, 10000)]
    public double Area { get; set; }
    
    public int? YearBuilt { get; set; }
}