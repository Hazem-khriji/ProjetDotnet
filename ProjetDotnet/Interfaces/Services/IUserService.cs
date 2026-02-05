﻿namespace ProjetDotnet.Interfaces.Services;
using ProjetDotnet.DTOs;
using ProjetDotnet.ViewModels;

public interface IUserService
{
    Task<UserDto?> GetByIdAsync(string id);
    Task<PagedResultDto<UserDto>> GetPagedAsync(int pageNumber, int pageSize, string? searchTerm = null);
    Task<PagedResultDto<UserDto>> GetPagedAsync(UserFilterDto filter);
    Task<bool> UpdateUserStatusAsync(string userId, bool isActive);
    Task<bool> UpdateUserRoleAsync(string userId, string role);
    Task<int> GetTotalCountAsync();
    Task<int> GetActiveCountAsync();
    Task<List<UserDto>> GetRecentUsersAsync(int count = 10);
    Task<UserDto> CreateUserAsync(UserCreateViewModel model);
    Task<UserDto> UpdateUserAsync(string id, UserEditViewModel model);
    Task<bool> DeleteUserAsync(string id);
}