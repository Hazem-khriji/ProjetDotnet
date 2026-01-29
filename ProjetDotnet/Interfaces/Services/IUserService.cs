namespace ProjetDotnet.Interfaces.Services;
using ProjetDotnet.DTOs;


public interface IUserService
{
    Task<UserDto> GetByIdAsync(string id);
    Task<PagedResultDto<UserDto>> GetPagedAsync(int pageNumber, int pageSize, string? searchTerm = null);
    Task<bool> UpdateUserStatusAsync(string userId, bool isActive);
    Task<bool> UpdateUserRoleAsync(string userId, string role);
    Task<int> GetTotalCountAsync();
    Task<int> GetActiveCountAsync();
}