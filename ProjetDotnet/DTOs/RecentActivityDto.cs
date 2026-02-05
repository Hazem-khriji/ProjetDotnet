namespace ProjetDotnet.DTOs;

public class RecentActivityDto
{
    public int Id { get; set; }
    public string ActivityType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? EntityType { get; set; }
    public int? EntityId { get; set; }
}
