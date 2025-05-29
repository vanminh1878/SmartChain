using ErrorOr;
using MediatR;

namespace SmartChain.Application.Schedules.Commands.DeleteSchedule;

public record DeleteScheduleCommand(Guid ScheduleId) : IRequest<ErrorOr<Success>>;