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
    public int Price { get; set; }
    public string Description { get; set; }
    public PropertyType Type { get; set; }
    public PropertyStatus Status { get; set; }
    public TransactionType Transaction{ get; set; }
    public string Adress { get; set; }
    public double Area { get; set; } 
    public ICollection<MediaType> Images { get; set; }
    
    
}