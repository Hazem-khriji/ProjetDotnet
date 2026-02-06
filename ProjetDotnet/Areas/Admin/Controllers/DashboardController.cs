using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjetDotnet.Interfaces.Services;
using ProjetDotnet.ViewModels;

namespace ProjetDotnet.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Roles = "Admin")]
public class DashboardController : Controller
{
    private readonly IStatisticsService _statisticsService;
    private readonly IPropertyService _propertyService;
    private readonly IUserService _userService;
    private readonly IInquiryService _inquiryService;

    public DashboardController(
        IStatisticsService statisticsService,
        IPropertyService propertyService,
        IUserService userService,
        IInquiryService inquiryService)
    {
        _statisticsService = statisticsService;
        _propertyService = propertyService;
        _userService = userService;
        _inquiryService = inquiryService;
    }

    public async Task<IActionResult> Index()
    {
        var statistics = await _statisticsService.GetDashboardStatisticsAsync();
        var recentActivities = await _statisticsService.GetRecentActivitiesAsync(10);
        
        // Get recent featured properties
        var featuredProperties = await _propertyService.GetFeaturedPropertiesAsync(5);
        
        // Get recent users
        var recentUsers = await _userService.GetRecentUsersAsync(5);

        var viewModel = new DashboardViewModel
        {
            Statistics = statistics,
            RecentActivities = recentActivities,
            FeaturedProperties = featuredProperties,
            RecentUsers = recentUsers
        };

        return View(viewModel);
    }

    [HttpGet]
    public async Task<IActionResult> GetStatistics()
    {
        var statistics = await _statisticsService.GetDashboardStatisticsAsync();
        return Json(statistics);
    }

    [HttpGet]
    public async Task<IActionResult> GetRecentActivities()
    {
        var activities = await _statisticsService.GetRecentActivitiesAsync(10);
        return Json(activities);
    }

    public async Task<IActionResult> Statistics()
    {
        var statistics = await _statisticsService.GetDashboardStatisticsAsync();
        return View(statistics);
    }
}
