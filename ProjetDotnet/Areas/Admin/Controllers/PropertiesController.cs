﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ProjetDotnet.DTOs;
using ProjetDotnet.Enums;
using ProjetDotnet.Interfaces.Services;
using ProjetDotnet.Models;
using ProjetDotnet.ViewModels;

namespace ProjetDotnet.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Roles = "Admin")]
public class PropertiesController : Controller
{
    private readonly IPropertyService _propertyService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public PropertiesController(
        IPropertyService propertyService,
        UserManager<ApplicationUser> userManager,
        IWebHostEnvironment webHostEnvironment)
    {
        _propertyService = propertyService;
        _userManager = userManager;
        _webHostEnvironment = webHostEnvironment;
    }

    public async Task<IActionResult> Index(PropertyFilterDto filter)
    {
        if (filter.PageNumber <= 0) filter.PageNumber = 1;
        if (filter.PageSize <= 0) filter.PageSize = 10;

        var result = await _propertyService.GetPagedAsync(filter);

        var viewModel = new PropertyListViewModel
        {
            Properties = result,
            Filter = filter,
            RouteValues = new Dictionary<string, object>
            {
                {"searchTerm", filter.SearchTerm ?? ""},
                {"type", filter.Type?.ToString() ?? ""},
                {"status", filter.Status?.ToString() ?? ""},
                {"pageSize", filter.PageSize}
            }
        };

        ViewBag.PropertyTypes = new SelectList(Enum.GetValues(typeof(PropertyType)));
        ViewBag.PropertyStatuses = new SelectList(Enum.GetValues(typeof(PropertyStatus)));

        return View(viewModel);
    }

    public async Task<IActionResult> Details(int id)
    {
        var property = await _propertyService.GetByIdAsync(id);
        if (property == null)
            return NotFound();

        return View(property);
    }

    public async Task<IActionResult> Create()
    {
        var viewModel = new PropertyCreateViewModel();
        await PopulateCreateViewData();
        return View(viewModel);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(PropertyCreateViewModel viewModel)
    {
        if (!ModelState.IsValid)
        {
            await PopulateCreateViewData();
            return View(viewModel);
        }

        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        var dto = new CreatePropertyDto
        {
            Title = viewModel.Title,
            Description = viewModel.Description,
            Price = viewModel.Price,
            Type = (PropertyType)viewModel.Type,
            Transaction = (TransactionType)viewModel.Transaction,
            Address = viewModel.Address,
            City = viewModel.City,
            Area = viewModel.Area,
            Bedrooms = viewModel.Bedrooms,
            Bathrooms = viewModel.Bathrooms,
            YearBuilt = viewModel.YearBuilt
        };

        try
        {
            await _propertyService.CreateAsync(dto, user);
            TempData["Success"] = "Property created successfully!";
            return RedirectToAction(nameof(Index));
        }
        catch (Exception ex)
        {
            ModelState.AddModelError("", ex.Message);
            await PopulateCreateViewData();
            return View(viewModel);
        }
    }

    public async Task<IActionResult> Edit(int id)
    {
        var property = await _propertyService.GetByIdAsync(id);
        if (property == null)
            return NotFound();

        var viewModel = new PropertyEditViewModel
        {
            Id = property.Id,
            Title = property.Title,
            Description = property.Description,
            Price = property.Price,
            Type = (int)property.Type,
            Transaction = (int)property.Transaction,
            Status = (int)property.Status,
            Address = property.Address,
            City = property.City,
            Area = property.Area,
            Bedrooms = property.Bedrooms,
            Bathrooms = property.Bathrooms,
            YearBuilt = property.YearBuilt,
            IsFeatured = property.IsFeatured
        };

        await PopulateEditViewData();
        return View(viewModel);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, PropertyEditViewModel viewModel)
    {
        if (!ModelState.IsValid)
        {
            await PopulateEditViewData();
            return View(viewModel);
        }

        var dto = new UpdatePropertyDto
        {
            Title = viewModel.Title,
            Description = viewModel.Description,
            Price = viewModel.Price,
            Type = (PropertyType)viewModel.Type,
            Transaction = (TransactionType)viewModel.Transaction,
            Status = (PropertyStatus)viewModel.Status,
            Address = viewModel.Address,
            City = viewModel.City,
            Area = viewModel.Area,
            Bedrooms = viewModel.Bedrooms,
            Bathrooms = viewModel.Bathrooms,
            YearBuilt = viewModel.YearBuilt,
            IsFeatured = viewModel.IsFeatured
        };

        try
        {
            await _propertyService.UpdateAsync(id, dto);
            TempData["Success"] = "Property updated successfully!";
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
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _propertyService.DeleteAsync(id);
        if (!result)
        {
            TempData["Error"] = "Property not found!";
            return RedirectToAction(nameof(Index));
        }

        TempData["Success"] = "Property deleted successfully!";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateStatus(int id, PropertyStatus status)
    {
        var result = await _propertyService.UpdateStatusAsync(id, status);
        if (!result)
        {
            TempData["Error"] = "Property not found!";
            return RedirectToAction(nameof(Index));
        }

        TempData["Success"] = "Property status updated successfully!";
        return RedirectToAction(nameof(Index));
    }

    private async Task PopulateCreateViewData()
    {
        ViewBag.PropertyTypes = new SelectList(Enum.GetValues(typeof(PropertyType)));
        ViewBag.TransactionTypes = new SelectList(Enum.GetValues(typeof(TransactionType)));
        ViewBag.Owners = new SelectList(await _userManager.Users.ToListAsync(), "Id", "FullName");
    }

    private async Task PopulateEditViewData()
    {
        ViewBag.PropertyTypes = new SelectList(Enum.GetValues(typeof(PropertyType)));
        ViewBag.PropertyStatuses = new SelectList(Enum.GetValues(typeof(PropertyStatus)));
        ViewBag.TransactionTypes = new SelectList(Enum.GetValues(typeof(TransactionType)));
        ViewBag.Owners = new SelectList(await _userManager.Users.ToListAsync(), "Id", "FullName");
    }
}
