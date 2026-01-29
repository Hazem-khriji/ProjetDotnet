namespace ProjetDotnet.Interfaces.Repository;
using ProjetDotnet.Models;
using ProjetDotnet.Enums;
using ProjetDotnet.DTOs;


public interface IPropertyRequestRepository : IRepository<Inquiry>
{
    Task<PagedResultDto<Inquiry>> GetPagedAsync(
        int pageNumber, int pageSize, InquiryStatus? status = null);
    Task<IEnumerable<Inquiry>> GetByPropertyIdAsync(int propertyId);
    Task<IEnumerable<Inquiry>> GetByUserIdAsync(string userId);
    Task<int> GetPendingCountAsync();
    Task<Inquiry?> GetByIdWithDetailsAsync(int id);
}