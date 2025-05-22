using System;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.Role.Events;

namespace SmartChain.Domain.Role;

public class Role : Entity
{
    public string Name { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Role(string name, Guid? id = null) : base(id)
    {
        if (string.IsNullOrEmpty(name))
        {
            throw new ArgumentException("Role name cannot be empty.");
        }
        if (name.Length > 20)
        {
            throw new ArgumentException("Role name cannot exceed 20 characters.");
        }

        Name = name;
        CreatedAt = DateTime.UtcNow;

        _domainEvents.Add(new RoleCreatedEvent(id ?? Guid.NewGuid(), name));
    }

    public ErrorOr<Success> UpdateName(string newName)
    {
        if (string.IsNullOrEmpty(newName))
        {
            return Error.Failure("Role name cannot be empty.");
        }
        if (newName.Length > 20)
        {
            return Error.Failure("Role name cannot exceed 20 characters.");
        }

        Name = newName;
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new RoleUpdatedEvent(Id, newName));
        return Result.Success;
    }
}