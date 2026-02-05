using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ProjetDotnet.Interfaces.Services;
using ProjetDotnet.Models;
using ProjetDotnet.ViewModels;

namespace ProjetDotnet.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Roles = "Admin")]
public class UsersController : Controller
{
    private readonly IUserService _userService;
    private readonly RoleManager<IdentityRole> _roleManager;

    public UsersController(
        IUserService userService,
        RoleManager<IdentityRole> roleManager)
    {
        _userService = userService;
        _roleManager = roleManager;
    }

    public async Task<IActionResult> Index(UserFilterDto filter)
    {
        if (filter.PageNumber <= 0) filter.PageNumber = 1;
        if (filter.PageSize <= 0) filter.PageSize = 10;

        var result = await _userService.GetPagedAsync(filter);

        var viewModel = new UserListViewModel
        {
            Users = result,
            Filter = filter
        };

        await PopulateFilterData();
        return View(viewModel);
    }

    public async Task<IActionResult> Details(string id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return NotFound();

        return View(user);
    }

    public async Task<IActionResult> Create()
    {
        var viewModel = new UserCreateViewModel();
        await PopulateCreateViewData();
        return View(viewModel);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(UserCreateViewModel viewModel)
    {
        if (!ModelState.IsValid)
        {
            await PopulateCreateViewData();
            return View(viewModel);
        }

        try
        {
            await _userService.CreateUserAsync(viewModel);
            TempData["Success"] = "User created successfully!";
            return RedirectToAction(nameof(Index));
        }
        catch (Exception ex)
        {
            ModelState.AddModelError("", ex.Message);
            await PopulateCreateViewData();
            return View(viewModel);
        }
    }

    public async Task<IActionResult> Edit(string id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return NotFound();

        var viewModel = new UserEditViewModel
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Address = user.Address ?? string.Empty,
            IsActive = user.IsActive,
            Role = user.Role
        };

        await PopulateEditViewData();
        return View(viewModel);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(string id, UserEditViewModel viewModel)
    {
        if (!ModelState.IsValid)
        {
            await PopulateEditViewData();
            return View(viewModel);
        }

        try
        {
            await _userService.UpdateUserAsync(id, viewModel);
            TempData["Success"] = "User updated successfully!";
            return RedirectToAction(nameof(Index));
        }
        catch (Exception ex)
        {
            ModelState.AddModelError("", ex.Message);
            await PopulateEditViewData();
            return View(viewModel);
        }
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            var result = await _userService.DeleteUserAsync(id);
            if (!result)
            {
                TempData["Error"] = "User not found!";
                return RedirectToAction(nameof(Index));
            }

            TempData["Success"] = "User deleted successfully!";
            return RedirectToAction(nameof(Index));
        }
        catch (Exception ex)
        {
            TempData["Error"] = ex.Message;
            return RedirectToAction(nameof(Index));
        }
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateStatus(string id, bool isActive)
    {
        var result = await _userService.UpdateUserStatusAsync(id, isActive);
        if (!result)
        {
            TempData["Error"] = "User not found!";
            return RedirectToAction(nameof(Index));
        }

        var status = isActive ? "activated" : "deactivated";
        TempData["Success"] = $"User {status} successfully!";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateRole(string id, string role)
    {
        var result = await _userService.UpdateUserRoleAsync(id, role);
        if (!result)
        {
            TempData["Error"] = "Failed to update user role!";
            return RedirectToAction(nameof(Index));
        }

        TempData["Success"] = "User role updated successfully!";
        return RedirectToAction(nameof(Index));
    }

    private async Task PopulateCreateViewData()
    {
        ViewBag.Roles = new SelectList(await _roleManager.Roles.Select(r => r.Name).ToListAsync(), "User");
    }

    private async Task PopulateEditViewData()
    {
        ViewBag.Roles = new SelectList(await _roleManager.Roles.Select(r => r.Name).ToListAsync());
    }

    private async Task PopulateFilterData()
    {
        ViewBag.Roles = new SelectList(await _roleManager.Roles.Select(r => r.Name).ToListAsync(), "All");
    }
}
