﻿using ProjetDotnet.DTOs;
using ProjetDotnet.Enums;
using ProjetDotnet.Interfaces.Repository;
using ProjetDotnet.Interfaces.Services;
using ProjetDotnet.Models;

namespace ProjetDotnet.Services;

public class InquiryService : IInquiryService
{
    private readonly IInquiryRepository _inquiryRepository;
    private readonly IPropertyRepository _propertyRepository;

    public InquiryService(IInquiryRepository inquiryRepository, IPropertyRepository propertyRepository)
    {
        _inquiryRepository = inquiryRepository;
        _propertyRepository = propertyRepository;
    }

    public async Task<InquiryDto?> GetByIdAsync(int id)
    {
        var inquiry = await _inquiryRepository.GetByIdWithDetailsAsync(id);
        if (inquiry == null)
            return null;

        return MapToDto(inquiry);
    }

    public async Task<PagedResultDto<InquiryDto>> GetPagedAsync(
        int pageNumber, int pageSize, InquiryStatus? status = null)
    {
        var pagedResult = await _inquiryRepository.GetPagedAsync(pageNumber, pageSize, status);

        return new PagedResultDto<InquiryDto>
        {
            Items = pagedResult.Items.Select(MapToDto).ToList(),
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };
    }

    public async Task<InquiryDto> CreateAsync(CreateInquiryDto dto, string userId)
    {
        var property = await _propertyRepository.GetByIdAsync(dto.PropertyId);
        if (property == null)
            throw new Exception("Property not found");

        var inquiry = new Inquiry
        {
            PropertyId = dto.PropertyId,
            UserId = userId,
            Message = dto.Message,
            PhoneNumber = dto.PhoneNumber,
            PreferredVisitDate = dto.PreferredVisitDate,
            Status = InquiryStatus.New,
            RequestDate = DateTime.UtcNow
        };

        var created = await _inquiryRepository.AddAsync(inquiry);
        return MapToDto(created);
    }

    public async Task<bool> UpdateStatusAsync(int id, InquiryStatus status, string? adminNotes = null)
    {
        var inquiry = await _inquiryRepository.GetByIdAsync(id);
        if (inquiry == null)
            return false;

        inquiry.Status = status;
        if (adminNotes != null)
            inquiry.AdminNotes = adminNotes;
        
        if (status != InquiryStatus.New)
            inquiry.ResponseDate = DateTime.UtcNow;

        await _inquiryRepository.UpdateAsync(inquiry);
        return true;
    }

    public async Task<int> GetPendingCountAsync()
    {
        return await _inquiryRepository.GetPendingCountAsync();
    }

    public async Task<PagedResultDto<InquiryDto>> GetInquiriesForAgentPropertiesAsync(
        string agentId, 
        int pageNumber, 
        int pageSize, 
        InquiryStatus? status = null)
    {
        var pagedResult = await _inquiryRepository.GetByPropertyOwnerIdAsync(
            agentId, pageNumber, pageSize, status);

        return new PagedResultDto<InquiryDto>
        {
            Items = pagedResult.Items.Select(MapToDto).ToList(),
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };
    }

    private InquiryDto MapToDto(Inquiry inquiry)
    {
        return new InquiryDto
        {
            Id = inquiry.Id,
            PropertyId = inquiry.PropertyId,
            PropertyTitle = inquiry.Property?.Title ?? string.Empty,
            UserId = inquiry.UserId,
            UserName = inquiry.User?.FullName ?? string.Empty,
            UserEmail = inquiry.User?.Email ?? string.Empty,
            Message = inquiry.Message,
            PhoneNumber = inquiry.PhoneNumber,
            PreferredVisitDate = inquiry.PreferredVisitDate,
            Status = inquiry.Status,
            RequestDate = inquiry.RequestDate,
            ResponseDate = inquiry.ResponseDate,
            AdminNotes = inquiry.AdminNotes
        };
    }
}
