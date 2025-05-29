using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SmartChain.Domain.Schedule;

namespace SmartChain.Application.Common.Interfaces;

public interface ISchedulesRepository
{
    Task AddAsync(Schedule schedule, CancellationToken cancellationToken);
    Task<Schedule?> GetByIdAsync(Guid scheduleId, CancellationToken cancellationToken);
    Task<List<Schedule>> ListAllAsync(CancellationToken cancellationToken);
    Task<List<Schedule>> ListByEmployeeIdAsync(Guid employeeId, CancellationToken cancellationToken);
    Task<List<Schedule>> ListByDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken);
    Task RemoveAsync(Schedule schedule, CancellationToken cancellationToken);
    Task RemoveRangeAsync(List<Schedule> schedules, CancellationToken cancellationToken);
    Task UpdateAsync(Schedule schedule, CancellationToken cancellationToken);
}