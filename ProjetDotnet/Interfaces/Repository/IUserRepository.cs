﻿namespace ProjetDotnet.Interfaces.Repository;
using ProjetDotnet.Models;
using ProjetDotnet.DTOs;
using ProjetDotnet.ViewModels;

public interface IUserRepository
{
    Task<ApplicationUser?> GetByIdAsync(string id);
    Task<PagedResultDto<ApplicationUser>> GetPagedAsync(int pageNumber, int pageSize, string? searchTerm = null);
    Task<PagedResultDto<ApplicationUser>> GetPagedAsync(UserFilterDto filter);
    Task<IEnumerable<ApplicationUser>> GetByRoleAsync(string role);
    Task<IEnumerable<ApplicationUser>> GetRecentUsersAsync(int count);
    Task<int> GetTotalCountAsync();
    Task<int> GetActiveCountAsync();
    Task<bool> UpdateUserStatusAsync(string userId, bool isActive);
}
