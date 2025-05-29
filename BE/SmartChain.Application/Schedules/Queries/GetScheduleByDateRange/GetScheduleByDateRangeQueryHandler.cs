using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Schedule;

namespace SmartChain.Application.Schedules.Queries.GetScheduleByStatus;

public class GetScheduleByDateRangeQueryHandler : IRequestHandler<GetScheduleByDateRangeQuery, ErrorOr<List<Schedule>>>
{
    private readonly ISchedulesRepository _SchedulesRepository;

    public GetScheduleByDateRangeQueryHandler(ISchedulesRepository schedulesRepository)
    {
        _SchedulesRepository = schedulesRepository;
    }

    public async Task<ErrorOr<List<Schedule>>> Handle(GetScheduleByDateRangeQuery request, CancellationToken cancellationToken)
    {
        var Schedule = await _SchedulesRepository.ListByDateRangeAsync(request.startDate, request.endDate, cancellationToken);
        if (Schedule is null)
        {
            return Error.NotFound(description: "Schedule not found.");
        }

        return Schedule;
    }
}