namespace ProjetDotnet.Models;

public class Message
{
    public int Id { get; set; }
    public string SenderId { get; set; }
    public string ReceiverId { get; set; }
    public string Subject { get; set; }
    public string Content { get; set; }
    public bool IsRead { get; set; }
    public DateTime SentDate { get; set; }
    public int? PropertyId { get; set; }  
    
    
    public ApplicationUser Sender { get; set; }
    public ApplicationUser Receiver { get; set; }
    public Property? Property { get; set; }
}