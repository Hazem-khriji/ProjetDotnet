﻿using Microsoft.AspNetCore.Identity;
using ProjetDotnet.DTOs;
using ProjetDotnet.Interfaces.Repository;
using ProjetDotnet.Interfaces.Services;
using ProjetDotnet.Models;
using ProjetDotnet.ViewModels;

namespace ProjetDotnet.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(IUserRepository userRepository, UserManager<ApplicationUser> userManager)
    {
        _userRepository = userRepository;
        _userManager = userManager;
    }

    public async Task<UserDto?> GetByIdAsync(string id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            return null;

        return await MapToDto(user);
    }

    public async Task<PagedResultDto<UserDto>> GetPagedAsync(int pageNumber, int pageSize, string? searchTerm = null)
    {
        var pagedResult = await _userRepository.GetPagedAsync(pageNumber, pageSize, searchTerm);

        var userDtos = new List<UserDto>();
        foreach (var user in pagedResult.Items)
        {
            userDtos.Add(await MapToDto(user));
        }

        return new PagedResultDto<UserDto>
        {
            Items = userDtos,
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };
    }

    public async Task<PagedResultDto<UserDto>> GetPagedAsync(UserFilterDto filter)
    {
        var pagedResult = await _userRepository.GetPagedAsync(filter);

        var userDtos = new List<UserDto>();
        foreach (var user in pagedResult.Items)
        {
            userDtos.Add(await MapToDto(user));
        }

        return new PagedResultDto<UserDto>
        {
            Items = userDtos,
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };
    }

    public async Task<List<UserDto>> GetRecentUsersAsync(int count = 10)
    {
        var users = await _userRepository.GetRecentUsersAsync(count);
        var userDtos = new List<UserDto>();
        
        foreach (var user in users)
        {
            userDtos.Add(await MapToDto(user));
        }

        return userDtos;
    }

    public async Task<UserDto> CreateUserAsync(UserCreateViewModel model)
    {
        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            FirstName = model.FirstName,
            LastName = model.LastName,
            PhoneNumber = model.PhoneNumber,
            Address = model.Address,
            IsActive = model.IsActive
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
        {
            throw new Exception($"Failed to create user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }

        await _userManager.AddToRoleAsync(user, model.Role);
        
        return await MapToDto(user);
    }

    public async Task<UserDto> UpdateUserAsync(string id, UserEditViewModel model)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            throw new Exception("User not found");

        user.FirstName = model.FirstName;
        user.LastName = model.LastName;
        user.Email = model.Email;
        user.UserName = model.Email;
        user.PhoneNumber = model.PhoneNumber;
        user.Address = model.Address;
        user.IsActive = model.IsActive;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            throw new Exception($"Failed to update user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }

        // Update role if changed
        var currentRoles = await _userManager.GetRolesAsync(user);
        if (!currentRoles.Contains(model.Role))
        {
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            await _userManager.AddToRoleAsync(user, model.Role);
        }

        return await MapToDto(user);
    }

    public async Task<bool> DeleteUserAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return false;

        // Check if user has properties - don't delete if they do
        if (user.Properties.Any())
        {
            throw new Exception("Cannot delete user with associated properties");
        }

        var result = await _userManager.DeleteAsync(user);
        return result.Succeeded;
    }

    public async Task<bool> UpdateUserStatusAsync(string userId, bool isActive)
    {
        return await _userRepository.UpdateUserStatusAsync(userId, isActive);
    }

    public async Task<bool> UpdateUserRoleAsync(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return false;

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        var result = await _userManager.AddToRoleAsync(user, role);
        
        return result.Succeeded;
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _userRepository.GetTotalCountAsync();
    }

    public async Task<int> GetActiveCountAsync()
    {
        return await _userRepository.GetActiveCountAsync();
    }

    private async Task<UserDto> MapToDto(ApplicationUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            FullName = user.FullName,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            Address = user.Address,
            Role = roles.FirstOrDefault() ?? "User",
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            PropertyCount = user.Properties?.Count ?? 0,
            RequestCount = user.Inquiries?.Count ?? 0
        };
    }
}
