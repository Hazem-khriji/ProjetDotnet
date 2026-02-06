using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjetDotnet.DTOs;
using ProjetDotnet.Interfaces.Services;
using ProjetDotnet.ViewModels;

namespace ProjetDotnet.Controllers.Api;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class UsersApiController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersApiController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResultDto<UserDto>>> GetUsers(
        [FromQuery] string? searchTerm,
        [FromQuery] string? role,
        [FromQuery] bool? isActive,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var filter = new UserFilterDto
        {
            SearchTerm = searchTerm,
            Role = role,
            IsActive = isActive,
            PageNumber = pageNumber,
            PageSize = pageSize
        };

        var result = await _userService.GetPagedAsync(filter);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(string id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return NotFound();

        return Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] UserCreateViewModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var user = await _userService.CreateUserAsync(model);
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserDto>> UpdateUser(string id, [FromBody] UserEditViewModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var user = await _userService.UpdateUserAsync(id, model);
            return Ok(user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        try
        {
            var result = await _userService.DeleteUserAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateUserStatus(string id, [FromBody] UpdateUserStatusDto dto)
    {
        var result = await _userService.UpdateUserStatusAsync(id, dto.IsActive);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpPut("{id}/role")]
    public async Task<IActionResult> UpdateUserRole(string id, [FromBody] UpdateUserRoleDto dto)
    {
        var result = await _userService.UpdateUserRoleAsync(id, dto.Role);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpGet("statistics")]
    public async Task<ActionResult> GetStatistics()
    {
        var totalCount = await _userService.GetTotalCountAsync();
        var activeCount = await _userService.GetActiveCountAsync();

        return Ok(new
        {
            totalCount,
            activeCount,
            inactiveCount = totalCount - activeCount
        });
    }

    [HttpGet("recent")]
    public async Task<ActionResult<List<UserDto>>> GetRecentUsers([FromQuery] int count = 10)
    {
        var users = await _userService.GetRecentUsersAsync(count);
        return Ok(users);
    }
}

public class UpdateUserStatusDto
{
    public bool IsActive { get; set; }
}

public class UpdateUserRoleDto
{
    public string Role { get; set; } = string.Empty;
}
