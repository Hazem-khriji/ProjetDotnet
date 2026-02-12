﻿namespace ProjetDotnet.Interfaces.Repository;
using ProjetDotnet.Models;
using ProjetDotnet.DTOs;
using ProjetDotnet.Enums;


public interface IInquiryRepository : IRepository<Inquiry>
{
    Task<PagedResultDto<Inquiry>> GetPagedAsync(int pageNumber, int pageSize, InquiryStatus? status = null);
    Task<Inquiry?> GetByIdWithDetailsAsync(int id);
    Task<IEnumerable<Inquiry>> GetByPropertyIdAsync(int propertyId);
    Task<IEnumerable<Inquiry>> GetByUserIdAsync(string userId);
    Task<int> GetPendingCountAsync();
    Task<PagedResultDto<Inquiry>> GetByPropertyOwnerIdAsync(string ownerId, int pageNumber, int pageSize, InquiryStatus? status = null);
}