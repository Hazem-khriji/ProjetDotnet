﻿﻿namespace ProjetDotnet.DTOs;
using ProjetDotnet.Enums;
using ProjetDotnet.Models;

public class PropertyDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public PropertyType Type { get; set; }
    public PropertyStatus Status { get; set; }
    public TransactionType Transaction { get; set; }
    public string Address { get; set; } = string.Empty;
    public string? City { get; set; }
    public double Area { get; set; }
    public int? Bedrooms { get; set; }
    public int? Bathrooms { get; set; }
    public int? YearBuilt { get; set; }
    public int ViewCount { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public PropertyOwnerDto? Owner { get; set; }
    public List<PropertyImageDto> Images { get; set; } = new();
    public string PrimaryImageUrl { get; set; } = string.Empty;
}