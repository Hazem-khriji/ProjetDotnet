using Microsoft.EntityFrameworkCore;
using ProjetDotnet.Data;
using ProjetDotnet.DTOs;
using ProjetDotnet.Interfaces.Repository;
using ProjetDotnet.Models;

namespace ProjetDotnet.Repositories;

public class MessageRepository : Repository<Message>, IMessageRepository
{
    public MessageRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<PagedResultDto<Message>> GetInboxAsync(string userId, int pageNumber, int pageSize)
    {
        var query = _dbSet
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Include(m => m.Property)
            .Where(m => m.ReceiverId == userId)
            .OrderByDescending(m => m.SentDate);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResultDto<Message>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<PagedResultDto<Message>> GetSentAsync(string userId, int pageNumber, int pageSize)
    {
        var query = _dbSet
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Include(m => m.Property)
            .Where(m => m.SenderId == userId)
            .OrderByDescending(m => m.SentDate);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResultDto<Message>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<int> GetUnreadCountAsync(string userId)
    {
        return await _dbSet.CountAsync(m => m.ReceiverId == userId && !m.IsRead);
    }

    public async Task MarkAsReadAsync(int messageId)
    {
        var message = await _dbSet.FindAsync(messageId);
        if (message != null)
        {
            message.IsRead = true;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<Message?> GetByIdWithDetailsAsync(int id)
    {
        return await _dbSet
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Include(m => m.Property)
            .FirstOrDefaultAsync(m => m.Id == id);
    }
}
