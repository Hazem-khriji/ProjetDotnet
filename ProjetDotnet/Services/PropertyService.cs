namespace ProjetDotnet.Services;

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
            Transaction = dto.Transaction,
            Status = dto.Status,
            Address = dto.Address,
            City = dto.City,
            Area = dto.Area,
            Bedrooms = dto.Bedrooms,
            Bathrooms = dto.Bathrooms,
            YearBuilt = dto.YearBuilt,
            IsFeatured = dto.IsFeatured,
            Owner = user,
            CreatedAt = DateTime.UtcNow,
            Images = new List<PropertyImage>()
        };

        // Handle image uploads
        if (dto.Images != null && dto.Images.Any())
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "properties");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            for (int i = 0; i < dto.Images.Count; i++)
            {
                var image = dto.Images[i];
                if (image.Length > 0)
                {
                    var uniqueFileName = $"{Guid.NewGuid()}_{image.FileName}";
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(fileStream);
                    }

                    var propertyImage = new PropertyImage
                    {
                        ImageUrl = $"/uploads/properties/{uniqueFileName}",
                        IsPrimary = i == 0, // First image is primary
                        DisplayOrder = i,
                        UploadedAt = DateTime.UtcNow
                    };

                    property.Images.Add(propertyImage);
                }
            }
        }

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
        property.Transaction = dto.Transaction;
        property.Status = dto.Status;
        property.Address = dto.Address;
        property.City = dto.City;
        property.Area = dto.Area;
        property.Bedrooms = dto.Bedrooms;
        property.Bathrooms = dto.Bathrooms;
        property.YearBuilt = dto.YearBuilt;
        property.IsFeatured = dto.IsFeatured;
        property.UpdatedAt = DateTime.UtcNow;

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

    public async Task<List<PropertyDto>> GetFeaturedPropertiesAsync(int count = 10)
    {
        var properties = await _propertyRepository.GetFeaturedAsync(count);
        return properties.Select(MapToDto).ToList();
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
            Transaction = property.Transaction,
            Address = property.Address,
            City = property.City,
            Area = property.Area,
            Bedrooms = property.Bedrooms,
            Bathrooms = property.Bathrooms,
            YearBuilt = property.YearBuilt,
            ViewCount = property.ViewCount,
            IsFeatured = property.IsFeatured,
            CreatedAt = property.CreatedAt,
            Owner = property.Owner != null ? new PropertyOwnerDto
            {
                Id = property.Owner.Id,
                FirstName = property.Owner.FirstName,
                LastName = property.Owner.LastName,
                FullName = property.Owner.FullName,
                PhoneNumber = property.Owner.PhoneNumber,
                Email = property.Owner.Email
            } : null,
            Images = property.Images?.Select(img => new PropertyImageDto
            {
                Id = img.Id,
                ImageUrl = img.ImageUrl,
                IsPrimary = img.IsPrimary,
                DisplayOrder = img.DisplayOrder
            }).ToList() ?? new List<PropertyImageDto>(),
            PrimaryImageUrl = property.Images?.FirstOrDefault(i => i.IsPrimary)?.ImageUrl ?? ""
        };
    }
}
