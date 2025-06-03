using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Schedule;

namespace SmartChain.Application.Schedules.Commands.CreateSchedule;

public class CreateScheduleCommandHandler : IRequestHandler<CreateScheduleCommand, ErrorOr<Schedule>>
{
    private readonly ISchedulesRepository _SchedulesRepository;

    public CreateScheduleCommandHandler(ISchedulesRepository schedulesRepository)
    {
        _SchedulesRepository = schedulesRepository;
    }

    public async Task<ErrorOr<Schedule>> Handle(CreateScheduleCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var Schedule = new Schedule(request.EmployeeId,request.StoreId, request.StartTime, request.EndTime);
            await _SchedulesRepository.AddAsync(Schedule, cancellationToken);
            return Schedule;
        }
        catch (ArgumentException ex)
        {
            return Error.Failure(description: ex.Message);
        }
    }
}