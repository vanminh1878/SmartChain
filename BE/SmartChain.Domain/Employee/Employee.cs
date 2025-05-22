using System;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.Employee.Events;

namespace SmartChain.Domain.Employee;

public class Employee : Entity
{
    public Guid UserId { get; private set; }
    public Guid StoreId { get; private set; }
    public bool Status { get; private set; } // true: active, false: locked
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Employee(Guid userId, Guid storeId, Guid? id = null) : base(id)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("User ID cannot be empty.");
        }
        if (storeId == Guid.Empty)
        {
            throw new ArgumentException("Store ID cannot be empty.");
        }

        UserId = userId;
        StoreId = storeId;
        Status = true; // Default: active
        CreatedAt = DateTime.UtcNow;

        _domainEvents.Add(new EmployeeCreatedEvent(id ?? Guid.NewGuid(), userId, storeId));
    }

    public ErrorOr<Success> UpdateStatus(bool newStatus)
    {
        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new EmployeeStatusUpdatedEvent(Id, newStatus));
        return Result.Success;
    }
}