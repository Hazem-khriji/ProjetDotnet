namespace ProjetDotnet.Interfaces.Repository;
using ProjetDotnet.Models;
using ProjetDotnet.Enums;
using ProjetDotnet.DTOs;
public interface IPropertyRepository : IRepository<Property>
{
    Task<PagedResult<Property>> GetPagedAsync(PropertyFilterDto filter);
    Task<IEnumerable<Property>> GetByUserIdAsync(string userId);
    Task<IEnumerable<Property>> GetByCityAsync(string city);
    Task<IEnumerable<Property>> GetByStatusAsync(PropertyStatus status);
    Task<IEnumerable<Property>> GetFeaturedAsync(int count);
    Task<Property?> GetByIdWithDetailsAsync(int id);
    Task<int> GetTotalCountAsync();
    Task<int> GetCountByStatusAsync(PropertyStatus status);
    Task IncrementViewCountAsync(int propertyId);
}