namespace ProjetDotnet.Interfaces.Services;
using ProjetDotnet.Data;
using ProjetDotnet.Models;
using ProjetDotnet.DTOs;
public interface IMessageService
{
    Task<MessageDto> SendMessageAsync(MessageDto dto, string senderId);
    Task<PagedResultDto<MessageDto>> GetInboxAsync(string userId, int pageNumber, int pageSize);
    Task<PagedResultDto<MessageDto>> GetSentAsync(string userId, int pageNumber, int pageSize);
    Task<MessageDto?> GetByIdAsync(int id, string userId);
    Task<bool> MarkAsReadAsync(int id, string userId);
    Task<int> GetUnreadCountAsync(string userId);
    Task DeleteAsync(int id, string userId);
}