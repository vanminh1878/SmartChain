using System;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.Schedule.Events;

namespace SmartChain.Domain.Schedule;

public class Schedule : Entity
{
    public Guid EmployeeId { get; private set; }
    public DateTime StartTime { get; private set; }
    public DateTime EndTime { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Schedule(Guid employeeId, DateTime startTime, DateTime endTime, Guid? id = null) : base(id)
    {
        if (employeeId == Guid.Empty)
        {
            throw new ArgumentException("Employee ID cannot be empty.");
        }
        if (startTime == DateTime.MinValue)
        {
            throw new ArgumentException("Start time cannot be empty or invalid.");
        }
        if (endTime == DateTime.MinValue)
        {
            throw new ArgumentException("End time cannot be empty or invalid.");
        }
        if (startTime >= endTime)
        {
            throw new ArgumentException("Start time must be before end time.");
        }

        EmployeeId = employeeId;
        StartTime = startTime;
        EndTime = endTime;
        CreatedAt = DateTime.UtcNow;

        _domainEvents.Add(new ScheduleCreatedEvent(id ?? Guid.NewGuid(), employeeId, startTime, endTime));
    }

    public ErrorOr<Success> Update(DateTime startTime, DateTime endTime)
    {
        if (startTime == DateTime.MinValue)
        {
            return Error.Failure("Start time cannot be empty or invalid.");
        }
        if (endTime == DateTime.MinValue)
        {
            return Error.Failure("End time cannot be empty or invalid.");
        }
        if (startTime >= endTime)
        {
            return Error.Failure("Start time must be before end time.");
        }

        StartTime = startTime;
        EndTime = endTime;
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new ScheduleUpdatedEvent(Id, EmployeeId, startTime, endTime));
        return Result.Success;
    }
    private Schedule() {}
}