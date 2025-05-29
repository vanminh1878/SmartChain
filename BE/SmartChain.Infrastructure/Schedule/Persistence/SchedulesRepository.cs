using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Schedule;
using SmartChain.Infrastructure.Common.Persistence;

namespace SmartChain.Infrastructure.Persistence.Repositories;

public class SchedulesRepository : ISchedulesRepository
{
    private readonly AppDbContext _context;

    public SchedulesRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Schedule schedule, CancellationToken cancellationToken)
    {
        await _context.Schedules.AddAsync(schedule, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Schedule?> GetByIdAsync(Guid scheduleId, CancellationToken cancellationToken)
    {
        return await _context.Schedules
            .FirstOrDefaultAsync(s => s.Id == scheduleId, cancellationToken);
    }

    public async Task<List<Schedule>> ListByEmployeeIdAsync(Guid employeeId, CancellationToken cancellationToken)
    {
        return await _context.Schedules
            .Where(s => s.EmployeeId == employeeId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Schedule>> ListByDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken)
    {
        return await _context.Schedules
            .Where(s => s.StartTime >= startDate && s.EndTime <= endDate)
            .ToListAsync(cancellationToken);
    }
    public async Task<List<Schedule>> ListAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Schedules
            .ToListAsync(cancellationToken);
    }
    public async Task RemoveAsync(Schedule schedule, CancellationToken cancellationToken)
    {
        _context.Schedules.Remove(schedule);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRangeAsync(List<Schedule> schedules, CancellationToken cancellationToken)
    {
        _context.Schedules.RemoveRange(schedules);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Schedule schedule, CancellationToken cancellationToken)
    {
        _context.Schedules.Update(schedule);
        await _context.SaveChangesAsync(cancellationToken);
    }
}