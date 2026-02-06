using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjetDotnet.DTOs;
using ProjetDotnet.Interfaces.Services;
using ProjetDotnet.Models;

namespace ProjetDotnet.Controllers.Api;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class MessagesApiController : ControllerBase
{
    private readonly IMessageService _messageService;
    private readonly UserManager<ApplicationUser> _userManager;

    public MessagesApiController(IMessageService messageService, UserManager<ApplicationUser> userManager)
    {
        _messageService = messageService;
        _userManager = userManager;
    }

    [HttpGet("inbox")]
    public async Task<ActionResult<PagedResultDto<MessageDto>>> GetInbox(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        var result = await _messageService.GetInboxAsync(user.Id, pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("sent")]
    public async Task<ActionResult<PagedResultDto<MessageDto>>> GetSent(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        var result = await _messageService.GetSentAsync(user.Id, pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MessageDto>> GetMessage(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        var message = await _messageService.GetByIdAsync(id, user.Id);
        if (message == null)
            return NotFound();

        return Ok(message);
    }

    [HttpPost]
    public async Task<ActionResult<MessageDto>> SendMessage([FromBody] MessageDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        try
        {
            var message = await _messageService.SendMessageAsync(dto, user.Id);
            return CreatedAtAction(nameof(GetMessage), new { id = message.Id }, message);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        var result = await _messageService.MarkAsReadAsync(id, user.Id);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMessage(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        try
        {
            await _messageService.DeleteAsync(id, user.Id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("unread-count")]
    public async Task<ActionResult<int>> GetUnreadCount()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        var count = await _messageService.GetUnreadCountAsync(user.Id);
        return Ok(new { count });
    }
}
