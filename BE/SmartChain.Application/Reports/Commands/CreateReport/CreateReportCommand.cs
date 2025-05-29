using ErrorOr;
using MediatR;
using SmartChain.Domain.Report;

namespace SmartChain.Application.Reports.Commands.CreateReport;

public record CreateReportCommand(Guid storeId, string reportType, DateTime startDate, DateTime endDate, Guid generatedBy, string filePath) : IRequest<ErrorOr<Report>>;