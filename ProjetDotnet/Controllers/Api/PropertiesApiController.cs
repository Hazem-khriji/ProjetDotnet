using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjetDotnet.DTOs;
using ProjetDotnet.Enums;
using ProjetDotnet.Interfaces.Services;
using ProjetDotnet.Models;

namespace ProjetDotnet.Controllers.Api;

[Route("api/[controller]")]
[ApiController]
public class PropertiesApiController : ControllerBase
{
    private readonly IPropertyService _propertyService;
    private readonly UserManager<ApplicationUser> _userManager;

    public PropertiesApiController(IPropertyService propertyService, UserManager<ApplicationUser> userManager)
    {
        _propertyService = propertyService;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResultDto<PropertyDto>>> GetProperties(
        [FromQuery] string? searchTerm,
        [FromQuery] PropertyType? type,
        [FromQuery] PropertyStatus? status,
        [FromQuery] TransactionType? transaction,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? city,
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
            City = city,
            PageNumber = pageNumber,
            PageSize = pageSize
        };

        var result = await _propertyService.GetPagedAsync(filter);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PropertyDto>> GetProperty(int id)
    {
        var property = await _propertyService.GetByIdAsync(id);
        if (property == null)
            return NotFound();

        return Ok(property);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Agent")]
    public async Task<ActionResult<PropertyDto>> CreateProperty([FromForm] CreatePropertyDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        try
        {
            var property = await _propertyService.CreateAsync(dto, user);
            return Ok(property);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Agent")]
    public async Task<ActionResult<PropertyDto>> UpdateProperty(int id, [FromBody] UpdatePropertyDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var property = await _propertyService.UpdateAsync(id, dto);
            return Ok(property);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProperty(int id)
    {
        var result = await _propertyService.DeleteAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin,Agent")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdatePropertyStatusDto dto)
    {
        var result = await _propertyService.UpdateStatusAsync(id, dto.Status);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpGet("featured")]
    public async Task<ActionResult<List<PropertyDto>>> GetFeaturedProperties([FromQuery] int count = 10)
    {
        var properties = await _propertyService.GetFeaturedPropertiesAsync(count);
        return Ok(properties);
    }

    [HttpGet("statistics")]
    public async Task<ActionResult> GetStatistics()
    {
        var count = await _propertyService.GetTotalCountAsync();
        return Ok(new { totalCount = count });
    }
}

public class UpdatePropertyStatusDto
{
    public PropertyStatus Status { get; set; }
}

