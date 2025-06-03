using ErrorOr;
using MediatR;

namespace SmartChain.Application.Schedules.Commands.UpdateSchedule;

public record UpdateScheduleCommand(Guid ScheduleId,Guid employeeId,Guid storeId, DateTime startTime, DateTime endTime) : IRequest<ErrorOr<Success>>;