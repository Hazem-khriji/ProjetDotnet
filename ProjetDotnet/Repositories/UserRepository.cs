using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProjetDotnet.Data;
using ProjetDotnet.DTOs;
using ProjetDotnet.Interfaces.Repository;
using ProjetDotnet.Models;
using ProjetDotnet.ViewModels;

namespace ProjetDotnet.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public UserRepository(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<ApplicationUser?> GetByIdAsync(string id)
    {
        return await _context.Users
            .Include(u => u.Properties)
            .Include(u => u.Inquiries)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<PagedResultDto<ApplicationUser>> GetPagedAsync(
        int pageNumber, int pageSize, string? searchTerm = null)
    {
        var query = _context.Users
            .Include(u => u.Properties)
            .Include(u => u.Inquiries)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(u =>
                u.FirstName.Contains(searchTerm) ||
                u.LastName.Contains(searchTerm) ||
                u.Email!.Contains(searchTerm));
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResultDto<ApplicationUser>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<PagedResultDto<ApplicationUser>> GetPagedAsync(UserFilterDto filter)
    {
        var query = _context.Users
            .Include(u => u.Properties)
            .Include(u => u.Inquiries)
            .AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
        {
            query = query.Where(u =>
                u.FirstName.Contains(filter.SearchTerm) ||
                u.LastName.Contains(filter.SearchTerm) ||
                u.Email!.Contains(filter.SearchTerm));
        }

        if (filter.IsActive.HasValue)
        {
            query = query.Where(u => u.IsActive == filter.IsActive.Value);
        }

        if (filter.CreatedFrom.HasValue)
        {
            query = query.Where(u => u.CreatedAt >= filter.CreatedFrom.Value);
        }

        if (filter.CreatedTo.HasValue)
        {
            query = query.Where(u => u.CreatedAt <= filter.CreatedTo.Value);
        }

        // Filter by role
        if (!string.IsNullOrWhiteSpace(filter.Role))
        {
            var usersInRole = await _userManager.GetUsersInRoleAsync(filter.Role);
            var userIdsInRole = usersInRole.Select(u => u.Id).ToList();
            query = query.Where(u => userIdsInRole.Contains(u.Id));
        }

        // Apply sorting
        query = filter.SortBy.ToLower() switch
        {
            "email" => filter.SortOrder.ToLower() == "asc" 
                ? query.OrderBy(u => u.Email) 
                : query.OrderByDescending(u => u.Email),
            "name" => filter.SortOrder.ToLower() == "asc" 
                ? query.OrderBy(u => u.FirstName).ThenBy(u => u.LastName)
                : query.OrderByDescending(u => u.FirstName).ThenByDescending(u => u.LastName),
            _ => query.OrderByDescending(u => u.CreatedAt)
        };

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((filter.PageNumber - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return new PagedResultDto<ApplicationUser>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize
        };
    }

    public async Task<IEnumerable<ApplicationUser>> GetRecentUsersAsync(int count)
    {
        return await _context.Users
            .Include(u => u.Properties)
            .Include(u => u.Inquiries)
            .OrderByDescending(u => u.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<IEnumerable<ApplicationUser>> GetByRoleAsync(string role)
    {
        var usersInRole = await _userManager.GetUsersInRoleAsync(role);
        return usersInRole;
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _context.Users.CountAsync();
    }

    public async Task<int> GetActiveCountAsync()
    {
        return await _context.Users.CountAsync(u => u.IsActive);
    }

    public async Task<bool> UpdateUserStatusAsync(string userId, bool isActive)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return false;

        user.IsActive = isActive;
        await _context.SaveChangesAsync();
        return true;
    }
}
