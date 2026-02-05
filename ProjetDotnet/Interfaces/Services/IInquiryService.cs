namespace ProjetDotnet.Interfaces.Services;
using ProjetDotnet.DTOs;
using ProjetDotnet.Enums;
public interface IInquiryService
{
    Task<InquiryDto?> GetByIdAsync(int id);
    Task<PagedResultDto<InquiryDto>> GetPagedAsync(
        int pageNumber, int pageSize, InquiryStatus? status = null);
    Task<InquiryDto> CreateAsync(CreateInquiryDto dto, string userId);
    Task<bool> UpdateStatusAsync(int id, InquiryStatus status, string? adminNotes = null);
    Task<int> GetPendingCountAsync();
}

