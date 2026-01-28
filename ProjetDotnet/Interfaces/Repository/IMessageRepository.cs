namespace ProjetDotnet.Interfaces.Repository;
using ProjetDotnet.Models;

public interface IMessageRepository : IRepository<Message>
{
    Task<PagedResult<Message>> GetInboxAsync(string userId, int pageNumber, int pageSize);
    Task<PagedResult<Message>> GetSentAsync(string userId, int pageNumber, int pageSize);
    Task<int> GetUnreadCountAsync(string userId);
    Task MarkAsReadAsync(int messageId);
    Task<Message?> GetByIdWithDetailsAsync(int id);
}