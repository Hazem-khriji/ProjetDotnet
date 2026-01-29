namespace ProjetDotnet.Interfaces.Repository;
using ProjetDotnet.DTOs;
using ProjetDotnet.Models;

public interface IMessageRepository : IRepository<Message>
{
    Task<PagedResultDto<Message>> GetInboxAsync(string userId, int pageNumber, int pageSize);
    Task<PagedResultDto<Message>> GetSentAsync(string userId, int pageNumber, int pageSize);
    Task<int> GetUnreadCountAsync(string userId);
    Task MarkAsReadAsync(int messageId);
    Task<Message?> GetByIdWithDetailsAsync(int id);
}