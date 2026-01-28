namespace ProjetDotnet.Interfaces.Repository;
using ProjetDotnet.Models;
using ProjetDotnet.Enums;


public interface IPropertyRequestRepository : IRepository<Inquiry>
{
    Task<PagedResult<Inquiry>> GetPagedAsync(
        int pageNumber, int pageSize, RequestStatus? status = null);
    Task<IEnumerable<Inquiry>> GetByPropertyIdAsync(int propertyId);
    Task<IEnumerable<Inquiry>> GetByUserIdAsync(string userId);
    Task<int> GetPendingCountAsync();
    Task<Inquiry?> GetByIdWithDetailsAsync(int id);
}