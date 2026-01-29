namespace ProjetDotnet.DTOs;
using System.ComponentModel.DataAnnotations;

public class CreateInquiryDto
{
    [Required]
    public int PropertyId { get; set; }
        
    [Required]
    [MaxLength(1000)]
    public string Message { get; set; } = string.Empty;
        
    [Required]
    [Phone]
    public string PhoneNumber { get; set; } = string.Empty;
        
    public DateTime? PreferredVisitDate { get; set; }
}