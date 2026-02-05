using ProjetDotnet.DTOs;
using ProjetDotnet.Interfaces.Repository;
using ProjetDotnet.Interfaces.Services;
using ProjetDotnet.Models;

namespace ProjetDotnet.Services;

public class MessageService : IMessageService
{
    private readonly IMessageRepository _messageRepository;

    public MessageService(IMessageRepository messageRepository)
    {
        _messageRepository = messageRepository;
    }

    public async Task<MessageDto> SendMessageAsync(MessageDto dto, string senderId)
    {
        var message = new Message
        {
            SenderId = senderId,
            ReceiverId = dto.ReceiverId,
            Subject = dto.Subject,
            Content = dto.Content,
            PropertyId = dto.PropertyId,
            IsRead = false,
            SentDate = DateTime.UtcNow
        };

        var created = await _messageRepository.AddAsync(message);
        
        // Reload with details
        var messageWithDetails = await _messageRepository.GetByIdWithDetailsAsync(created.Id);
        return MapToDto(messageWithDetails!);
    }

    public async Task<PagedResultDto<MessageDto>> GetInboxAsync(string userId, int pageNumber, int pageSize)
    {
        var pagedResult = await _messageRepository.GetInboxAsync(userId, pageNumber, pageSize);

        return new PagedResultDto<MessageDto>
        {
            Items = pagedResult.Items.Select(MapToDto).ToList(),
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };
    }

    public async Task<PagedResultDto<MessageDto>> GetSentAsync(string userId, int pageNumber, int pageSize)
    {
        var pagedResult = await _messageRepository.GetSentAsync(userId, pageNumber, pageSize);

        return new PagedResultDto<MessageDto>
        {
            Items = pagedResult.Items.Select(MapToDto).ToList(),
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };
    }

    public async Task<MessageDto?> GetByIdAsync(int id, string userId)
    {
        var message = await _messageRepository.GetByIdWithDetailsAsync(id);
        if (message == null)
            return null;

        // Verify the user has access to this message
        if (message.SenderId != userId && message.ReceiverId != userId)
            return null;

        // Mark as read if the receiver is viewing
        if (message.ReceiverId == userId && !message.IsRead)
        {
            await _messageRepository.MarkAsReadAsync(id);
            message.IsRead = true;
        }

        return MapToDto(message);
    }

    public async Task<bool> MarkAsReadAsync(int id, string userId)
    {
        var message = await _messageRepository.GetByIdWithDetailsAsync(id);
        if (message == null || message.ReceiverId != userId)
            return false;

        await _messageRepository.MarkAsReadAsync(id);
        return true;
    }

    public async Task<int> GetUnreadCountAsync(string userId)
    {
        return await _messageRepository.GetUnreadCountAsync(userId);
    }

    public async Task DeleteAsync(int id, string userId)
    {
        var message = await _messageRepository.GetByIdWithDetailsAsync(id);
        if (message == null)
            throw new Exception("Message not found");

        // Verify the user has access to delete this message
        if (message.SenderId != userId && message.ReceiverId != userId)
            throw new UnauthorizedAccessException("You don't have permission to delete this message");

        await _messageRepository.DeleteAsync(id);
    }

    private MessageDto MapToDto(Message message)
    {
        return new MessageDto
        {
            Id = message.Id,
            SenderId = message.SenderId,
            ReceiverId = message.ReceiverId,
            Subject = message.Subject,
            Content = message.Content,
            IsRead = message.IsRead,
            SentDate = message.SentDate,
            PropertyId = message.PropertyId,
            Sender = message.Sender != null ? new UserDto
            {
                Id = message.Sender.Id,
                Email = message.Sender.Email ?? string.Empty,
                FirstName = message.Sender.FirstName,
                LastName = message.Sender.LastName,
                FullName = message.Sender.FullName
            } : null!,
            Receiver = message.Receiver != null ? new UserDto
            {
                Id = message.Receiver.Id,
                Email = message.Receiver.Email ?? string.Empty,
                FirstName = message.Receiver.FirstName,
                LastName = message.Receiver.LastName,
                FullName = message.Receiver.FullName
            } : null!,
            Property = message.Property != null ? new PropertyDto
            {
                Id = message.Property.Id,
                Title = message.Property.Title
            } : null
        };
    }
}
