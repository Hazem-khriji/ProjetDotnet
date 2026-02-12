using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjetDotnet.DTOs;
using ProjetDotnet.Models;

namespace ProjetDotnet.Controllers.Api;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto model)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            
            return BadRequest(new AuthResponseDto
            {
                Success = false,
                Message = "Validation failed",
                Errors = errors
            });
        }
        
        var existingUser = await _userManager.FindByEmailAsync(model.Email);
        if (existingUser != null)
        {
            return BadRequest(new AuthResponseDto
            {
                Success = false,
                Message = "User with this email already exists",
                Errors = new List<string> { "Email is already registered" }
            });
        }
        
        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            FirstName = model.FirstName,
            LastName = model.LastName,
            PhoneNumber = model.PhoneNumber,
            Address = model.Address,
            EmailConfirmed = false, 
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(new AuthResponseDto
            {
                Success = false,
                Message = "Failed to create user",
                Errors = errors
            });
        }
        
        await _userManager.AddToRoleAsync(user, "Client");

        _logger.LogInformation("User {Email} registered successfully", model.Email);
        
        await _signInManager.SignInAsync(user, isPersistent: false);

        var userDto = new UserDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            FullName = user.FullName,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            Address = user.Address,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            Roles = new List<string> { "Client" }
        };

        return Ok(new AuthResponseDto
        {
            Success = true,
            Message = "Registration successful",
            User = userDto
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto model)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            
            return BadRequest(new AuthResponseDto
            {
                Success = false,
                Message = "Validation failed",
                Errors = errors
            });
        }

        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            return Unauthorized(new AuthResponseDto
            {
                Success = false,
                Message = "Invalid email or password",
                Errors = new List<string> { "Invalid credentials" }
            });
        }

        if (!user.IsActive)
        {
            return Unauthorized(new AuthResponseDto
            {
                Success = false,
                Message = "Your account is inactive",
                Errors = new List<string> { "Account is inactive" }
            });
        }

        var result = await _signInManager.PasswordSignInAsync(
            user, 
            model.Password, 
            model.RememberMe, 
            lockoutOnFailure: false);

        if (!result.Succeeded)
        {
            return Unauthorized(new AuthResponseDto
            {
                Success = false,
                Message = "Invalid email or password",
                Errors = new List<string> { "Invalid credentials" }
            });
        }
        
        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        var roles = await _userManager.GetRolesAsync(user);
        
        var userDto = new UserDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            FullName = user.FullName,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            Address = user.Address,
            ProfileImageUrl = user.ProfileImageUrl,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt,
            Roles = roles.ToList()
        };

        _logger.LogInformation("User {Email} logged in successfully", user.Email);

        return Ok(new AuthResponseDto
        {
            Success = true,
            Message = "Login successful",
            User = userDto
        });
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult<AuthResponseDto>> Logout()
    {
        await _signInManager.SignOutAsync();
        
        return Ok(new AuthResponseDto
        {
            Success = true,
            Message = "Logout successful"
        });
    }

    [HttpGet("current-user")]
    [Authorize]
    public async Task<ActionResult<AuthResponseDto>> GetCurrentUser()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized(new AuthResponseDto
            {
                Success = false,
                Message = "User not found",
                Errors = new List<string> { "Not authenticated" }
            });
        }

        var roles = await _userManager.GetRolesAsync(user);
        
        var userDto = new UserDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            FullName = user.FullName,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            Address = user.Address,
            ProfileImageUrl = user.ProfileImageUrl,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt,
            Roles = roles.ToList()
        };

        return Ok(new AuthResponseDto
        {
            Success = true,
            Message = "User retrieved successfully",
            User = userDto
        });
    }

    [HttpGet("check-auth")]
    public async Task<ActionResult<AuthResponseDto>> CheckAuth()
    {
        var isAuthenticated = User.Identity?.IsAuthenticated ?? false;
        
        if (!isAuthenticated)
        {
            return Ok(new AuthResponseDto
            {
                Success = false,
                Message = "User is not authenticated"
            });
        }

        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Ok(new AuthResponseDto
            {
                Success = false,
                Message = "User not found"
            });
        }

        var roles = await _userManager.GetRolesAsync(user);
        
        var userDto = new UserDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            FullName = user.FullName,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            Address = user.Address,
            ProfileImageUrl = user.ProfileImageUrl,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt,
            Roles = roles.ToList()
        };

        return Ok(new AuthResponseDto
        {
            Success = true,
            Message = "User is authenticated",
            User = userDto
        });
    }
}

