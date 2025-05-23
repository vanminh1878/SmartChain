using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Report;
using SmartChain.Infrastructure.Common.Persistence;

namespace SmartChain.Infrastructure.Persistence.Repositories;

public class ReportsRepository : IReportsRepository
{
    private readonly AppDbContext _context;

    public ReportsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Report report, CancellationToken cancellationToken)
    {
        await _context.Reports.AddAsync(report, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Report?> GetByIdAsync(Guid reportId, CancellationToken cancellationToken)
    {
        return await _context.Reports
            .FirstOrDefaultAsync(r => r.Id == reportId, cancellationToken);
    }

    public async Task<List<Report>> ListByStoreIdAsync(Guid storeId, CancellationToken cancellationToken)
    {
        return await _context.Reports
            .Where(r => r.StoreId == storeId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Report>> ListByGeneratedByAsync(Guid generatedBy, CancellationToken cancellationToken)
    {
        return await _context.Reports
            .Where(r => r.GeneratedBy == generatedBy)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Report>> ListByReportTypeAsync(string reportType, CancellationToken cancellationToken)
    {
        return await _context.Reports
            .Where(r => r.ReportType == reportType)
            .ToListAsync(cancellationToken);
    }

    public async Task RemoveAsync(Report report, CancellationToken cancellationToken)
    {
        _context.Reports.Remove(report);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRangeAsync(List<Report> reports, CancellationToken cancellationToken)
    {
        _context.Reports.RemoveRange(reports);
        await _context.SaveChangesAsync(cancellationToken);
    }
}