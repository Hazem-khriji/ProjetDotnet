using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ProjetDotnet.Enums;

namespace ProjetDotnet.Models;

public class Property
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
    
    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;
    
    public PropertyType Type { get; set; }
    public PropertyStatus Status { get; set; } = PropertyStatus.Available;
    public TransactionType Transaction { get; set; }
    
    [Required]
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? City { get; set; }
    
    public double Area { get; set; }
    public int? Bedrooms { get; set; }
    public int? Bathrooms { get; set; }
    public int? YearBuilt { get; set; }
    public bool IsFeatured { get; set; } = false;
    public int ViewCount { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Foreign Key
    public string? OwnerId { get; set; }
    
    // Navigation Properties
    [ForeignKey("OwnerId")]
    public ApplicationUser? Owner { get; set; }
    public ICollection<PropertyImage> Images { get; set; } = new List<PropertyImage>();
    public ICollection<Inquiry> Inquiries { get; set; } = new List<Inquiry>();
}