namespace ProjetDotnet.Interfaces.Services;

public interface IMessageService
{
    Task<MessageDto> SendMessageAsync(CreateMessageDto dto, string senderId);
    Task<PagedResult<MessageDto>> GetInboxAsync(string userId, int pageNumber, int pageSize);
    Task<PagedResult<MessageDto>> GetSentAsync(string userId, int pageNumber, int pageSize);
    Task<MessageDto> GetByIdAsync(int id, string userId);
    Task<bool> MarkAsReadAsync(int id, string userId);
    Task<int> GetUnreadCountAsync(string userId);
    Task DeleteAsync(int id, string userId);
}