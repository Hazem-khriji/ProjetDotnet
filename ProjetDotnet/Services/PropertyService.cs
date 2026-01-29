namespace ProjetDotnet.Services;

// RealEstateAdmin.Infrastructure/Services/PropertyService.cs (Créer le dossier Services)
using ProjetDotnet.DTOs;
using ProjetDotnet.Interfaces.Services;
using ProjetDotnet.Data;
using ProjetDotnet.Models;
using ProjetDotnet.Enums;
using ProjetDotnet.Interfaces.Repository;  


public class PropertyService : IPropertyService
{
    private readonly IPropertyRepository _propertyRepository;

    public PropertyService(IPropertyRepository propertyRepository)
    {
        _propertyRepository = propertyRepository;
    }

    public async Task<PropertyDto?> GetByIdAsync(int id)
    {
        var property = await _propertyRepository.GetByIdWithDetailsAsync(id);
        if (property == null)
            return null;

        return MapToDto(property);
    }

    public async Task<PagedResultDto<PropertyDto>> GetPagedAsync(PropertyFilterDto filter)
    {
        var pagedResult = await _propertyRepository.GetPagedAsync(filter);

        return new PagedResultDto<PropertyDto>
        {
            Items = pagedResult.Items.Select(MapToDto).ToList(),
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };
    }

    public async Task<PropertyDto> CreateAsync(CreatePropertyDto dto, ApplicationUser user)
    {
        var property = new Property
        {
            Title = dto.Title,
            Description = dto.Description,
            Price = dto.Price,
            Type = dto.Type,
            Status = PropertyStatus.Available,
            Address = dto.Address,
            Area = dto.Area,
            Owner = user,
            
        };

        var created = await _propertyRepository.AddAsync(property);
        return MapToDto(created);
    }

    public async Task<PropertyDto> UpdateAsync(int id, UpdatePropertyDto dto)
    {
        var property = await _propertyRepository.GetByIdAsync(id);
        if (property == null)
            throw new Exception("Property not found");

        property.Title = dto.Title;
        property.Description = dto.Description;
        property.Price = dto.Price;
        property.Type = dto.Type;
        property.Status = dto.Status;
        property.Address = dto.Address;
        property.Area = dto.Area;
        //property.IsFeatured = dto.IsFeatured;

        await _propertyRepository.UpdateAsync(property);
        return MapToDto(property);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var exists = await _propertyRepository.ExistsAsync(id);
        if (!exists)
            return false;

        await _propertyRepository.DeleteAsync(id);
        return true;
    }

    // public async Task<bool> ToggleFeaturedAsync(int id)
    // {
    //     var property = await _propertyRepository.GetByIdAsync(id);
    //     if (property == null)
    //         return false;
    //
    //     property.IsFeatured = !property.IsFeatured;
    //     await _propertyRepository.UpdateAsync(property);
    //     return true;
    // }

    public async Task<bool> UpdateStatusAsync(int id, PropertyStatus status)
    {
        var property = await _propertyRepository.GetByIdAsync(id);
        if (property == null)
            return false;

        property.Status = status;
        await _propertyRepository.UpdateAsync(property);
        return true;
    }

    // public async Task<IEnumerable<PropertyDto>> GetFeaturedAsync(int count)
    // {
    //     var properties = await _propertyRepository.GetFeaturedAsync(count);
    //     return properties.Select(MapToDto);
    // }

    public async Task<int> GetTotalCountAsync()
    {
        return await _propertyRepository.GetTotalCountAsync();
    }

    private PropertyDto MapToDto(Property property)
    {
        return new PropertyDto
        {
            Id = property.Id,
            Title = property.Title,
            Description = property.Description,
            Price = property.Price,
            Type = property.Type,
            Status = property.Status,
            Address = property.Address,
            Area = property.Area,
            ViewCount = property.Inquiries.Count,
            //IsFeatured = property.IsFeatured,
            //CreatedAt = property.CreatedAt,
            Owner = property.Owner,
            PrimaryImageUrl = property.Images?.FirstOrDefault(i => i.IsPrimary)?.ImageUrl ?? ""
        };
    }
}
