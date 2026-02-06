using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjetDotnet.DTOs;
using ProjetDotnet.Enums;
using ProjetDotnet.Interfaces.Services;
using ProjetDotnet.Models;

namespace ProjetDotnet.Controllers.Api;

[Route("api/[controller]")]
[ApiController]
public class InquiriesApiController : ControllerBase
{
    private readonly IInquiryService _inquiryService;
    private readonly UserManager<ApplicationUser> _userManager;

    public InquiriesApiController(IInquiryService inquiryService, UserManager<ApplicationUser> userManager)
    {
        _inquiryService = inquiryService;
        _userManager = userManager;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PagedResultDto<InquiryDto>>> GetInquiries(
        [FromQuery] InquiryStatus? status,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _inquiryService.GetPagedAsync(pageNumber, pageSize, status);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<InquiryDto>> GetInquiry(int id)
    {
        var inquiry = await _inquiryService.GetByIdAsync(id);
        if (inquiry == null)
            return NotFound();

        var user = await _userManager.GetUserAsync(User);
        
        // Check if user has access (is admin or is the inquiry owner)
        if (!User.IsInRole("Admin") && inquiry.UserId != user?.Id)
            return Forbid();

        return Ok(inquiry);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<InquiryDto>> CreateInquiry([FromBody] CreateInquiryDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        try
        {
            var inquiry = await _inquiryService.CreateAsync(dto, user.Id);
            return CreatedAtAction(nameof(GetInquiry), new { id = inquiry.Id }, inquiry);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateInquiryStatusDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _inquiryService.UpdateStatusAsync(id, dto.Status, dto.AdminNotes);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpGet("pending-count")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<int>> GetPendingCount()
    {
        var count = await _inquiryService.GetPendingCountAsync();
        return Ok(new { count });
    }
}

public class UpdateInquiryStatusDto
{
    public InquiryStatus Status { get; set; }
    public string? AdminNotes { get; set; }
}
