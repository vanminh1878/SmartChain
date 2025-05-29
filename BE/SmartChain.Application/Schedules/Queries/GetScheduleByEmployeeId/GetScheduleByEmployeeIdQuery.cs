using ErrorOr;
using MediatR;
using SmartChain.Domain.Schedule;

namespace SmartChain.Application.Schedules.Queries.GetScheduleByStatus
{
    public record GetScheduleByEmployeeIdQuery(Guid employeeId) : IRequest<ErrorOr<List<Schedule>>>;
}