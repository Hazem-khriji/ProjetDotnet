using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using ProjetDotnet.DTOs;
using ProjetDotnet.Enums;
using ProjetDotnet.Interfaces.Services;

namespace ProjetDotnet.Controllers.Api;

[Route("api/[controller]")]
[ApiController]
public class PropertiesApiController : ControllerBase
{
    private readonly IPropertyService _propertyService;

    public PropertiesApiController(IPropertyService propertyService)
    {
        _propertyService = propertyService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResultDto<PropertyDto>>> GetProperties(
        [FromQuery] string? searchTerm,
        [FromQuery] PropertyType? type,
        [FromQuery] PropertyStatus? status,
        [FromQuery] TransactionType? transaction,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var filter = new PropertyFilterDto
        {
            SearchTerm = searchTerm,
            Type = type,
            Status = status,
            Transaction = transaction,
            MinPrice = minPrice,
            MaxPrice = maxPrice,
            PageNumber = pageNumber,
            PageSize = pageSize
        };

        var result = await _propertyService.GetPagedAsync(filter);
        return  Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PropertyDto>> GetProperty(int id)
    {
        var property = await _propertyService.GetByIdAsync(id);
        if (property == null)
            return NotFound();

        return Ok(property);
    }

    [HttpGet("statistics")]
    public async Task<ActionResult<int>> GetTotalCount()
    {
        var count = await _propertyService.GetTotalCountAsync();
        return Ok(new { totalCount = count });
    }
}
