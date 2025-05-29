using ErrorOr;
using MediatR;

namespace SmartChain.Application.Schedules.Commands.UpdateSchedule;

public record UpdateScheduleCommand(Guid ScheduleId,Guid employeeId, DateTime startTime, DateTime endTime) : IRequest<ErrorOr<Success>>;