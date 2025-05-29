using ErrorOr;
using MediatR;
using SmartChain.Domain.Schedule;

namespace SmartChain.Application.Schedules.Queries.GetScheduleByStatus
{
    public record GetScheduleByDateRangeQuery(DateTime startDate, DateTime endDate) : IRequest<ErrorOr<List<Schedule>>>;
}