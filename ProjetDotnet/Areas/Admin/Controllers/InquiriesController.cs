using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using ProjetDotnet.Enums;
using ProjetDotnet.Interfaces.Services;

namespace ProjetDotnet.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Roles = "Admin")]
public class InquiriesController : Controller
{
    private readonly IInquiryService _inquiryService;

    public InquiriesController(IInquiryService inquiryService)
    {
        _inquiryService = inquiryService;
    }

    public async Task<IActionResult> Index(InquiryStatus? status, int pageNumber = 1, int pageSize = 10)
    {
        var result = await _inquiryService.GetPagedAsync(pageNumber, pageSize, status);

        ViewBag.SelectedStatus = status;
        ViewBag.InquiryStatuses = new SelectList(Enum.GetValues(typeof(InquiryStatus)));

        return View(result);
    }

    public async Task<IActionResult> Details(int id)
    {
        var inquiry = await _inquiryService.GetByIdAsync(id);
        if (inquiry == null)
            return NotFound();

        ViewBag.InquiryStatuses = new SelectList(Enum.GetValues(typeof(InquiryStatus)));
        return View(inquiry);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateStatus(int id, InquiryStatus status, string? adminNotes)
    {
        var result = await _inquiryService.UpdateStatusAsync(id, status, adminNotes);
        if (!result)
        {
            TempData["Error"] = "Inquiry not found!";
            return RedirectToAction(nameof(Index));
        }

        TempData["Success"] = "Inquiry status updated successfully!";
        return RedirectToAction(nameof(Details), new { id });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> MarkAsContacted(int id)
    {
        var result = await _inquiryService.UpdateStatusAsync(id, InquiryStatus.Contacted);
        if (!result)
        {
            TempData["Error"] = "Inquiry not found!";
            return RedirectToAction(nameof(Index));
        }

        TempData["Success"] = "Inquiry marked as contacted!";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Close(int id, string? adminNotes)
    {
        var result = await _inquiryService.UpdateStatusAsync(id, InquiryStatus.Closed, adminNotes);
        if (!result)
        {
            TempData["Error"] = "Inquiry not found!";
            return RedirectToAction(nameof(Index));
        }

        TempData["Success"] = "Inquiry closed!";
        return RedirectToAction(nameof(Index));
    }
}
