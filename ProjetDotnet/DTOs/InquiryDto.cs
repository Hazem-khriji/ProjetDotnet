namespace ProjetDotnet.DTOs;
using ProjetDotnet.Models;
using ProjetDotnet.Enums;
public class InquiryDto
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    public string PropertyTitle { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTime? PreferredVisitDate { get; set; }
    public InquiryStatus Status { get; set; }
    public DateTime RequestDate { get; set; }
    public DateTime? ResponseDate { get; set; }
    public string? AdminNotes { get; set; }
}