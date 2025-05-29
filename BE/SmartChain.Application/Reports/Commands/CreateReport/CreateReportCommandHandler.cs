using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Report;

namespace SmartChain.Application.Reports.Commands.CreateReport;

public class CreateReportCommandHandler : IRequestHandler<CreateReportCommand, ErrorOr<Report>>
{
    private readonly IReportsRepository _ReportsRepository;

    public CreateReportCommandHandler(IReportsRepository reportsRepository)
    {
        _ReportsRepository = reportsRepository;
    }

    public async Task<ErrorOr<Report>> Handle(CreateReportCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var Report = new Report(request.storeId, request.reportType, request.startDate, request.endDate, request.generatedBy, request.filePath);
            await _ReportsRepository.AddAsync(Report, cancellationToken);
            return Report;
        }
        catch (ArgumentException ex)
        {
            return Error.Failure(description: ex.Message);
        }
    }
}