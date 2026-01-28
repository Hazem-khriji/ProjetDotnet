using ProjetDotnet.Enums;

namespace ProjetDotnet.Models;

public class Inquiry
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    public string UserId { get; set; }
    public string Message { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime? PreferredVisitDate { get; set; }
    public InquiryStatus Status { get; set; } 
    public DateTime RequestDate { get; set; }
    public DateTime? ResponseDate { get; set; }
    public string? AdminNotes { get; set; }
    
    
    public Property Property { get; set; }
    public ApplicationUser User { get; set; }
}