using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SmartChain.Domain.Report;

namespace SmartChain.Application.Common.Interfaces;

public interface IReportsRepository
{
    Task AddAsync(Report report, CancellationToken cancellationToken);
    Task<Report?> GetByIdAsync(Guid reportId, CancellationToken cancellationToken);
    Task<List<Report>> ListByStoreIdAsync(Guid storeId, CancellationToken cancellationToken);
    Task<List<Report>> ListByGeneratedByAsync(Guid generatedBy, CancellationToken cancellationToken);
    Task<List<Report>> ListByReportTypeAsync(string reportType, CancellationToken cancellationToken);
    Task RemoveAsync(Report report, CancellationToken cancellationToken);
    Task RemoveRangeAsync(List<Report> reports, CancellationToken cancellationToken);
}