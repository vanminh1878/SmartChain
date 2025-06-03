using System;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.Schedule.Events;

namespace SmartChain.Domain.Schedule;

public class Schedule : Entity
{
    public Guid EmployeeId { get; private set; }
    public Guid StoreId { get; private set; }
    public DateTime StartTime { get; private set; }
    public DateTime EndTime { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Schedule(Guid employeeId, Guid storeId, DateTime startTime, DateTime endTime, Guid? id = null) : base(id)
    {
        if (employeeId == Guid.Empty)
        {
            throw new ArgumentException("Employee ID cannot be empty.");
        }
        if (storeId == Guid.Empty)
        {
            throw new ArgumentException("Store ID cannot be empty.");
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
        StoreId = storeId;
        StartTime = startTime;
        EndTime = endTime;
        CreatedAt = DateTime.UtcNow;

        _domainEvents.Add(new ScheduleCreatedEvent(id ?? Guid.NewGuid(), employeeId, startTime, endTime));
    }

    public ErrorOr<Success> Update(Guid employeeId, Guid storeId, DateTime startTime, DateTime endTime)
    {
        if (employeeId == Guid.Empty)
        {
            return Error.Failure("EmployeeId cannot be empty");
        }
        if (storeId == Guid.Empty)
        {
            return Error.Failure("StoreId cannot be empty");
        }
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

        EmployeeId = employeeId;
        StoreId = storeId;
        StartTime = startTime;
        EndTime = endTime;
        UpdatedAt = DateTime.UtcNow;

        _domainEvents.Add(new ScheduleUpdatedEvent(Id, employeeId, startTime, endTime));
        return Result.Success;
    }

    public ErrorOr<Success> Delete(Guid scheduleId)
    {
        if (scheduleId == Guid.Empty)
        {
            return Error.Failure("ScheduleId cannot be empty");
        }
        
        if (scheduleId != Id)
        {
            return Error.Failure("Invalid schedule ID");
        }

        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new ScheduleDeletedEvent(Id, EmployeeId));
        return Result.Success;
    }

    private Schedule() { }
}