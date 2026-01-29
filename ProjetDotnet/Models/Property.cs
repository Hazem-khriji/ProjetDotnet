using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore;
using ProjetDotnet.Enums;

namespace ProjetDotnet.Models;

public class Property
{
    [Key]
    public int Id { get; set; }
    public string Title { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public PropertyType Type { get; set; }
    public PropertyStatus Status { get; set; }
    public TransactionType Transaction{ get; set; }
    public string Address { get; set; }
    public double Area { get; set; } 
    public ICollection<PropertyImage> Images { get; set; }
    public ICollection<Inquiry> Inquiries { get; set; }
    public ApplicationUser Owner { get; set; }
    
    
}