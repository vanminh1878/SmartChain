using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Schedule;

namespace SmartChain.Application.Schedules.Commands.UpdateSchedule;

public class UpdateScheduleCommandHandler : IRequestHandler<UpdateScheduleCommand, ErrorOr<Success>>
{
    private readonly ISchedulesRepository _SchedulesRepository;

    public UpdateScheduleCommandHandler(ISchedulesRepository schedulesRepository)
    {
        _SchedulesRepository = schedulesRepository;
    }

    public async Task<ErrorOr<Success>> Handle(UpdateScheduleCommand request, CancellationToken cancellationToken)
    {
        var Schedule = await _SchedulesRepository.GetByIdAsync(request.ScheduleId, cancellationToken);
        if (Schedule is null)
        {
            return Error.NotFound(description: "Schedule not found.");
        }

        var result = Schedule.Update(request.employeeId,request.storeId, request.startTime, request.endTime);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _SchedulesRepository.UpdateAsync(Schedule, cancellationToken);
        return Result.Success;
    }
}