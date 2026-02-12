﻿namespace ProjetDotnet.Repositories;
using Microsoft.EntityFrameworkCore;
using ProjetDotnet.Interfaces.Repository;
using ProjetDotnet.Data;
using ProjetDotnet.Models;
using ProjetDotnet.Enums;
using ProjetDotnet.DTOs;
public class InquiryRepository : Repository<Inquiry>, IInquiryRepository
    {
        public InquiryRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<PagedResultDto<Inquiry>> GetPagedAsync(
            int pageNumber, 
            int pageSize, 
            InquiryStatus? status = null)
        {
            var query = _dbSet
                .Include(r => r.Property)
                .Include(r => r.User)
                .AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(r => r.Status == status.Value);
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(r => r.RequestDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResultDto<Inquiry>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<Inquiry?> GetByIdWithDetailsAsync(int id)
        {
            return await _dbSet
                .Include(r => r.Property)
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<Inquiry>> GetByPropertyIdAsync(int propertyId)
        {
            return await _dbSet
                .Include(r => r.User)
                .Where(r => r.PropertyId == propertyId)
                .OrderByDescending(r => r.RequestDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Inquiry>> GetByUserIdAsync(string userId)
        {
            return await _dbSet
                .Include(r => r.Property)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.RequestDate)
                .ToListAsync();
        }

        public async Task<int> GetPendingCountAsync()
        {
            return await _dbSet.CountAsync(r => r.Status == InquiryStatus.Pending);
        }

        public async Task<PagedResultDto<Inquiry>> GetByPropertyOwnerIdAsync(
            string ownerId, 
            int pageNumber, 
            int pageSize, 
            InquiryStatus? status = null)
        {
            var query = _dbSet
                .Include(r => r.Property)
                .Include(r => r.User)
                .Where(r => r.Property.OwnerId == ownerId)
                .AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(r => r.Status == status.Value);
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(r => r.RequestDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResultDto<Inquiry>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
    }