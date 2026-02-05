using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjetDotnet.DTOs;
using ProjetDotnet.Interfaces.Services;
using ProjetDotnet.Models;

namespace ProjetDotnet.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Roles = "Admin")]
public class MessagesController : Controller
{
    private readonly IMessageService _messageService;
    private readonly IUserService _userService;
    private readonly UserManager<ApplicationUser> _userManager;

    public MessagesController(
        IMessageService messageService,
        IUserService userService,
        UserManager<ApplicationUser> userManager)
    {
        _messageService = messageService;
        _userService = userService;
        _userManager = userManager;
    }

    public async Task<IActionResult> Inbox(int pageNumber = 1, int pageSize = 10)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        var result = await _messageService.GetInboxAsync(user.Id, pageNumber, pageSize);
        return View(result);
    }

    public async Task<IActionResult> Sent(int pageNumber = 1, int pageSize = 10)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        var result = await _messageService.GetSentAsync(user.Id, pageNumber, pageSize);
        return View(result);
    }

    public async Task<IActionResult> Details(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        var message = await _messageService.GetByIdAsync(id, user.Id);
        if (message == null)
            return NotFound();

        return View(message);
    }

    public async Task<IActionResult> Compose(string? receiverId)
    {
        var users = await _userService.GetPagedAsync(1, 100);
        ViewBag.Users = users.Items;
        ViewBag.ReceiverId = receiverId;
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Send(MessageDto dto)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        if (string.IsNullOrEmpty(dto.ReceiverId) || string.IsNullOrEmpty(dto.Subject) || string.IsNullOrEmpty(dto.Content))
        {
            TempData["Error"] = "Please fill all required fields!";
            return RedirectToAction(nameof(Compose));
        }

        await _messageService.SendMessageAsync(dto, user.Id);
        TempData["Success"] = "Message sent successfully!";
        return RedirectToAction(nameof(Sent));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        try
        {
            await _messageService.DeleteAsync(id, user.Id);
            TempData["Success"] = "Message deleted!";
        }
        catch (Exception)
        {
            TempData["Error"] = "Failed to delete message!";
        }

        return RedirectToAction(nameof(Inbox));
    }
}
