using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjetDotnet.DTOs;
using ProjetDotnet.Interfaces.Services;

namespace ProjetDotnet.Controllers.Api;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class StatisticsApiController : ControllerBase
{
    private readonly IStatisticsService _statisticsService;

    public StatisticsApiController(IStatisticsService statisticsService)
    {
        _statisticsService = statisticsService;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardStatisticsDto>> GetDashboardStatistics()
    {
        var statistics = await _statisticsService.GetDashboardStatisticsAsync();
        return Ok(statistics);
    }
}
