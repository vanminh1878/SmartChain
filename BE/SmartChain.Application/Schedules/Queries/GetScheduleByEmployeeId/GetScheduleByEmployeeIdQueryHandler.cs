using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Schedule;

namespace SmartChain.Application.Schedules.Queries.GetScheduleByStatus;

public class GetScheduleByStatusQueryHandler : IRequestHandler<GetScheduleByEmployeeIdQuery, ErrorOr<List<Schedule>>>
{
    private readonly ISchedulesRepository _SchedulesRepository;

    public GetScheduleByStatusQueryHandler(ISchedulesRepository schedulesRepository)
    {
        _SchedulesRepository = schedulesRepository;
    }

    public async Task<ErrorOr<List<Schedule>>> Handle(GetScheduleByEmployeeIdQuery request, CancellationToken cancellationToken)
    {
        var Schedule = await _SchedulesRepository.ListByEmployeeIdAsync(request.employeeId, cancellationToken);
        if (Schedule is null)
        {
            return Error.NotFound(description: "Schedule not found.");
        }

        return Schedule;
    }
}