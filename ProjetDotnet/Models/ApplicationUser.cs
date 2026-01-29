namespace ProjetDotnet.Models;

using Microsoft.AspNetCore.Identity;
using ProjetDotnet.Enums;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName => $"{FirstName} {LastName}";
    public string PhoneNumber {get; set;}
    public string email { get; set; }
    public UserRole Role { get; set; }
    
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    
    public ICollection<Property> Properties { get; set; }
    public ICollection<Inquiry> Inquiries { get; set; }
    public ICollection<Message> SentMessages { get; set; }
    public ICollection<Message> ReceivedMessages { get; set; }
}