namespace ProjetDotnet.Interfaces.Services;
using ProjetDotnet.DTOs;
using ProjetDotnet.Enums;
public class IInquiryService
{
    Task<PropertyRequestDto> GetByIdAsync(int id);
    Task<PagedResult<PropertyRequestDto>> GetPagedAsync(
        int pageNumber, int pageSize, RequestStatus? status = null);
    Task<PropertyRequestDto> CreateAsync(CreateRequestDto dto, string userId);
    Task<bool> UpdateStatusAsync(int id, RequestStatus status, string? adminNotes = null);
    Task<int> GetPendingCountAsync();
}

