using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Schedule;

namespace SmartChain.Application.Schedules.Queries.GetSchedule;

public class GetScheduleQueryHandler : IRequestHandler<GetScheduleQuery, ErrorOr<List<Schedule>>>
{
    private readonly ISchedulesRepository _SchedulesRepository;

    public GetScheduleQueryHandler(ISchedulesRepository schedulesRepository)
    {
        _SchedulesRepository = schedulesRepository;
    }

    public async Task<ErrorOr<List<Schedule>>> Handle(GetScheduleQuery request, CancellationToken cancellationToken)
    {
        var Schedule = await _SchedulesRepository.ListAllAsync(cancellationToken);
        if (Schedule is null)
        {
            return Error.NotFound(description: "Schedule not found.");
        }

        return Schedule;
    }
}