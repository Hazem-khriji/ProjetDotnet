namespace ProjetDotnet.Models;

public class PropertyImage
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public bool IsPrimary { get; set; }
    public int DisplayOrder { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        
    // Navigation Property
    public Property Property { get; set; } = null!;
}