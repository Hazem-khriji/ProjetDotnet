namespace ProjetDotnet.Interfaces.Repository;
using ProjetDotnet.Models;
public interface IUserRepository
{
    Task<ApplicationUser?> GetByIdAsync(string id);
    Task<PagedResult<ApplicationUser>> GetPagedAsync(
        int pageNumber, int pageSize, string? searchTerm = null);
    Task<IEnumerable<ApplicationUser>> GetByRoleAsync(string role);
    Task<int> GetTotalCountAsync();
    Task<int> GetActiveCountAsync();
    Task<bool> UpdateUserStatusAsync(string userId, bool isActive);
}
