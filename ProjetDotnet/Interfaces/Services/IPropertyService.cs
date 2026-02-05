﻿namespace ProjetDotnet.Interfaces.Services;
using ProjetDotnet.DTOs;
using ProjetDotnet.Enums;
using ProjetDotnet.Models;
 
public interface IPropertyService
{
    Task<PropertyDto?> GetByIdAsync(int id);
    Task<PagedResultDto<PropertyDto>> GetPagedAsync(PropertyFilterDto filter);
    Task<PropertyDto> CreateAsync(CreatePropertyDto dto, ApplicationUser user);
    Task<PropertyDto> UpdateAsync(int id, UpdatePropertyDto dto);
    Task<bool> DeleteAsync(int id);
    Task<bool> UpdateStatusAsync(int id, PropertyStatus status);
    Task<int> GetTotalCountAsync();
    Task<List<PropertyDto>> GetFeaturedPropertiesAsync(int count = 10);
}
