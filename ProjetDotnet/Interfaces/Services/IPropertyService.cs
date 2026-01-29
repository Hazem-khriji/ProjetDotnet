namespace ProjetDotnet.Interfaces.Services;
using ProjetDotnet.DTOs;
using ProjetDotnet.Enums;
 
public interface IPropertyService
{
    Task<PropertyDto> GetByIdAsync(int id);
    Task<PagedResultDto<PropertyDto>> GetPagedAsync(PropertyFilterDto filter);
    //Task<PropertyDto> CreateAsync(CreatePropertyDto dto, string userId);
    Task <bool> DeleteAsync(int id);
    //Task<bool> ToggleFeaturedAsync(int id);
    Task<bool> UpdateStatusAsync(int id, PropertyStatus status);
    //Task<IEnumerable<PropertyDto>> GetFeaturedAsync(int count);
    Task<int> GetTotalCountAsync();
}
