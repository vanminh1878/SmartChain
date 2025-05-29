using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Schedule;

namespace SmartChain.Application.Schedules.Commands.DeleteSchedule;

public class DeleteScheduleCommandHandler : IRequestHandler<DeleteScheduleCommand, ErrorOr<Success>>
{
    private readonly ISchedulesRepository _SchedulesRepository;

    public DeleteScheduleCommandHandler(ISchedulesRepository schedulesRepository)
    {
        _SchedulesRepository = schedulesRepository;
    }

    public async Task<ErrorOr<Success>> Handle(DeleteScheduleCommand request, CancellationToken cancellationToken)
    {
        var Schedule = await _SchedulesRepository.GetByIdAsync(request.ScheduleId, cancellationToken);
        if (Schedule is null)
        {
            return Error.NotFound(description: "Schedule not found.");
        }

        var result = Schedule.Delete(request.ScheduleId);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _SchedulesRepository.UpdateAsync(Schedule, cancellationToken);
        return Result.Success;
    }
}