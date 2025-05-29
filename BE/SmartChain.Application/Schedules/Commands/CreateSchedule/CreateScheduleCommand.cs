using ErrorOr;
using MediatR;
using SmartChain.Domain.Schedule;

namespace SmartChain.Application.Schedules.Commands.CreateSchedule;

public record CreateScheduleCommand(Guid EmployeeId, DateTime StartTime, DateTime EndTime) : IRequest<ErrorOr<Schedule>>;