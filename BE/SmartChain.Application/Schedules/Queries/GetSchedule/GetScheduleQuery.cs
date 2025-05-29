using ErrorOr;
using MediatR;
using SmartChain.Domain.Schedule;
using SmartChain.Domain.Role;

namespace SmartChain.Application.Schedules.Queries.GetSchedule
{
    public record GetScheduleQuery() : IRequest<ErrorOr<List<Schedule>>>;
}