namespace ProjetDotnet.DTOs;
using ProjetDotnet.Enums;
using ProjetDotnet.Models;

public class PropertyDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public PropertyType Type { get; set; }
    public PropertyStatus Status { get; set; }
    public string Address { get; set; }
    public double Area { get; set; }
    public int ViewCount { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime CreatedAt { get; set; }
    
    
    public UserDto Owner { get; set; }
    public List<PropertyImage> Images { get; set; }
    public string PrimaryImageUrl { get; set; }
}