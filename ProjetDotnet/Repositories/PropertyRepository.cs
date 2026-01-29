namespace ProjetDotnet.Repositories;

using Microsoft.EntityFrameworkCore;
using ProjetDotnet.DTOs;
using ProjetDotnet.Models;
using ProjetDotnet.Enums;
using ProjetDotnet.Data;
using ProjetDotnet.Interfaces.Repository;

{
    public class PropertyRepository : Repository<Property>, IPropertyRepository
    {
        public PropertyRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<PagedResultDto<Property>> GetPagedAsync(PropertyFilterDto filter)
        {
            var query = _dbSet
                .Include(p => p.User)
                .Include(p => p.Images)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                query = query.Where(p => 
                    p.Title.Contains(filter.SearchTerm) || 
                    p.Description.Contains(filter.SearchTerm) ||
                    p.City.Contains(filter.SearchTerm));
            }

            if (filter.Type.HasValue)
                query = query.Where(p => p.Type == filter.Type.Value);

            if (filter.Category.HasValue)
                query = query.Where(p => p.Category == filter.Category.Value);

            if (filter.Status.HasValue)
                query = query.Where(p => p.Status == filter.Status.Value);

            if (!string.IsNullOrWhiteSpace(filter.City))
                query = query.Where(p => p.City == filter.City);

            if (filter.MinPrice.HasValue)
                query = query.Where(p => p.Price >= filter.MinPrice.Value);

            if (filter.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= filter.MaxPrice.Value);

            if (filter.MinBedrooms.HasValue)
                query = query.Where(p => p.Bedrooms >= filter.MinBedrooms.Value);

            if (filter.MaxBedrooms.HasValue)
                query = query.Where(p => p.Bedrooms <= filter.MaxBedrooms.Value);

            if (filter.MinArea.HasValue)
                query = query.Where(p => p.Area >= filter.MinArea.Value);

            if (filter.MaxArea.HasValue)
                query = query.Where(p => p.Area <= filter.MaxArea.Value);

            if (filter.IsFeatured.HasValue)
                query = query.Where(p => p.IsFeatured == filter.IsFeatured.Value);

            // Apply sorting
            query = filter.SortBy.ToLower() switch
            {
                "price" => filter.SortOrder.ToLower() == "asc" 
                    ? query.OrderBy(p => p.Price) 
                    : query.OrderByDescending(p => p.Price),
                "date" => filter.SortOrder.ToLower() == "asc" 
                    ? query.OrderBy(p => p.CreatedAt) 
                    : query.OrderByDescending(p => p.CreatedAt),
                "views" => filter.SortOrder.ToLower() == "asc" 
                    ? query.OrderBy(p => p.ViewCount) 
                    : query.OrderByDescending(p => p.ViewCount),
                _ => query.OrderByDescending(p => p.CreatedAt)
            };

            var totalCount = await query.CountAsync();

            // Apply pagination
            var items = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PagedResult<Property>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<Property?> GetByIdWithDetailsAsync(int id)
        {
            return await _dbSet
                .Include(p => p.User)
                .Include(p => p.Images)
                .Include(p => p.Requests)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Property>> GetByUserIdAsync(string userId)
        {
            return await _dbSet
                .Include(p => p.Images)
                .Where(p => p.UserId == userId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Property>> GetByCityAsync(string city)
        {
            return await _dbSet
                .Include(p => p.Images)
                .Where(p => p.City == city)
                .ToListAsync();
        }

        public async Task<IEnumerable<Property>> GetByStatusAsync(PropertyStatus status)
        {
            return await _dbSet
                .Include(p => p.Images)
                .Where(p => p.Status == status)
                .ToListAsync();
        }

        public async Task<IEnumerable<Property>> GetFeaturedAsync(int count)
        {
            return await _dbSet
                .Include(p => p.Images)
                .Where(p => p.IsFeatured && p.Status == PropertyStatus.Available)
                .OrderByDescending(p => p.CreatedAt)
                .Take(count)
                .ToListAsync();
        }

        public async Task<int> GetTotalCountAsync()
        {
            return await _dbSet.CountAsync();
        }

        public async Task<int> GetCountByStatusAsync(PropertyStatus status)
        {
            return await _dbSet.CountAsync(p => p.Status == status);
        }

        public async Task IncrementViewCountAsync(int propertyId)
        {
            var property = await GetByIdAsync(propertyId);
            if (property != null)
            {
                property.ViewCount++;
                await _context.SaveChangesAsync();
            }
        }
    }
}