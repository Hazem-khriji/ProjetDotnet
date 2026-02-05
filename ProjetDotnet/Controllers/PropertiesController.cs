using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjetDotnet.DTOs;
using ProjetDotnet.Enums;
using ProjetDotnet.Interfaces.Services;
using ProjetDotnet.Models;

namespace ProjetDotnet.Controllers;

public class PropertiesController : Controller
{
    private readonly IPropertyService _propertyService;
    private readonly IInquiryService _inquiryService;
    private readonly UserManager<ApplicationUser> _userManager;

    public PropertiesController(
        IPropertyService propertyService,
        IInquiryService inquiryService,
        UserManager<ApplicationUser> userManager)
    {
        _propertyService = propertyService;
        _inquiryService = inquiryService;
        _userManager = userManager;
    }
    [HttpGet]
    public async Task<IActionResult> Index(
        string? searchTerm,
        PropertyType? type,
        TransactionType? transaction,
        decimal? minPrice,
        decimal? maxPrice,
        int pageNumber = 1)
    {
        var filter = new PropertyFilterDto
        {
            SearchTerm = searchTerm,
            Type = type,
            Transaction = transaction,
            Status = PropertyStatus.Available, // Only show available properties
            MinPrice = minPrice,
            MaxPrice = maxPrice,
            PageNumber = pageNumber,
            PageSize = 12
        };

        var result = await _propertyService.GetPagedAsync(filter);

        ViewBag.SearchTerm = searchTerm;
        ViewBag.SelectedType = type;
        ViewBag.SelectedTransaction = transaction;
        ViewBag.MinPrice = minPrice;
        ViewBag.MaxPrice = maxPrice;

        return View(result);
    }

    public async Task<IActionResult> Details(int id)
    {
        var property = await _propertyService.GetByIdAsync(id);
        if (property == null)
            return NotFound();

        return View(property);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SendInquiry(CreateInquiryDto dto)
    {
        if (!User.Identity?.IsAuthenticated ?? true)
        {
            TempData["Error"] = "Please login to send an inquiry.";
            return RedirectToAction("Details", new { id = dto.PropertyId });
        }

        if (!ModelState.IsValid)
        {
            TempData["Error"] = "Please fill in all required fields.";
            return RedirectToAction("Details", new { id = dto.PropertyId });
        }

        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            TempData["Error"] = "User not found.";
            return RedirectToAction("Details", new { id = dto.PropertyId });
        }

        try
        {
            await _inquiryService.CreateAsync(dto, user.Id);
            TempData["Success"] = "Your inquiry has been sent successfully!";
        }
        catch (Exception)
        {
            TempData["Error"] = "Failed to send inquiry. Please try again.";
        }

        return RedirectToAction("Details", new { id = dto.PropertyId });
    }
}
