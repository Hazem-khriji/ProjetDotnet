namespace ProjetDotnet.DTOs;
using ProjetDotnet.DTOs;
public class MessageDto
{
    public int Id { get; set; }
    public string SenderId { get; set; }
    public string ReceiverId { get; set; }
    public string Subject { get; set; }
    public string Content { get; set; }
    public bool IsRead { get; set; }
    public DateTime SentDate { get; set; }
    public int? PropertyId { get; set; }  
    
    
    public UserDto Sender { get; set; }
    public UserDto Receiver { get; set; }
    public PropertyDto? Property { get; set; }
}