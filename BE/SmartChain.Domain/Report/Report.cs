using System;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.Report.Events;

namespace SmartChain.Domain.Report;

public class Report : Entity
{
    public Guid StoreId { get; private set; }
    public string ReportType { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public Guid GeneratedBy { get; private set; }
    public string FilePath { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public Report(Guid storeId, string reportType, DateTime startDate, DateTime endDate, Guid generatedBy, string filePath, Guid? id = null) : base(id)
    {
        if (storeId == Guid.Empty)
        {
            throw new ArgumentException("Store ID cannot be empty.");
        }
        if (string.IsNullOrEmpty(reportType))
        {
            throw new ArgumentException("Report type cannot be empty.");
        }
        if (reportType.Length > 50)
        {
            throw new ArgumentException("Report type cannot exceed 50 characters.");
        }
        if (startDate == DateTime.MinValue)
        {
            throw new ArgumentException("Start date cannot be empty or invalid.");
        }
        if (endDate == DateTime.MinValue)
        {
            throw new ArgumentException("End date cannot be empty or invalid.");
        }
        if (startDate > endDate)
        {
            throw new ArgumentException("Start date must be before or equal to end date.");
        }
        if (generatedBy == Guid.Empty)
        {
            throw new ArgumentException("GeneratedBy ID cannot be empty.");
        }
        if (string.IsNullOrEmpty(filePath))
        {
            throw new ArgumentException("File path cannot be empty.");
        }

        StoreId = storeId;
        ReportType = reportType;
        StartDate = startDate;
        EndDate = endDate;
        GeneratedBy = generatedBy;
        FilePath = filePath;
        CreatedAt = DateTime.UtcNow;

        _domainEvents.Add(new ReportCreatedEvent(id ?? Guid.NewGuid(), storeId, reportType, generatedBy));
    }
    private Report() {}
}