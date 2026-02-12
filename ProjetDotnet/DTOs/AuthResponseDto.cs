namespace ProjetDotnet.DTOs;

public class AuthResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public UserDto? User { get; set; }
    public List<string> Errors { get; set; } = new();
}

