﻿namespace ProjetDotnet.DTOs;
using System.ComponentModel.DataAnnotations;
using ProjetDotnet.Enums;

public class CreatePropertyDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }
    
    [Required]
    public PropertyType Type { get; set; }
    
    [Required]
    public TransactionType Transaction { get; set; }
    
    [Required]
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? City { get; set; }
    
    [Required]
    [Range(1, 10000)]
    public double Area { get; set; }
    
    [Range(0, 50)]
    public int? Bedrooms { get; set; }
    
    [Range(0, 50)]
    public int? Bathrooms { get; set; }
    
    [Range(1800, 2050)]
    public int? YearBuilt { get; set; }
}