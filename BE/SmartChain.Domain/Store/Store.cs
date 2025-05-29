using System;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.Store.Events;

namespace SmartChain.Domain.Store;

public class Store : Entity
{
    public string Name { get; private set; }
    public string Address { get; private set; }
    public string PhoneNumber { get; private set; }
    public string Email { get; private set; }
    public bool? Status { get; private set; } // true: active, false: locked
    public Guid OwnerId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Store(string name, string address, string phoneNumber, string email, Guid ownerId, Guid? id = null) : base(id)
    {
        if (string.IsNullOrEmpty(name))
        {
            throw new ArgumentException("Store name cannot be empty.");
        }
        if (string.IsNullOrEmpty(email))
        {
            throw new ArgumentException("Email cannot be empty.");
        }
        if (IsNotValidEmail(email))
        {
            throw new ArgumentException("Invalid email format.");
        }
        if (ownerId == Guid.Empty)
        {
            throw new ArgumentException("Owner ID cannot be empty.");
        }

        Name = name;
        Address = address ?? string.Empty;
        PhoneNumber = phoneNumber ?? string.Empty;
        Email = email;
        Status = true; // Default: active
        OwnerId = ownerId;
        CreatedAt = DateTime.UtcNow;

        _domainEvents.Add(new StoreCreatedEvent(id ?? Guid.NewGuid(), name, ownerId));
    }

    public ErrorOr<Success> Update(string name, string address, string phoneNumber, string email)
    {
        if (string.IsNullOrEmpty(name))
        {
            return Error.Failure("Store name cannot be empty.");
        }
        if (string.IsNullOrEmpty(email))
        {
            return Error.Failure("Email cannot be empty.");
        }
        if (IsNotValidEmail(email))
        {
            return Error.Failure("Invalid email format.");
        }

        Name = name;
        Address = address ?? string.Empty;
        PhoneNumber = phoneNumber ?? string.Empty;
        Email = email;
        UpdatedAt = DateTime.UtcNow;

        _domainEvents.Add(new StoreUpdatedEvent(Id, name));
        return Result.Success;
    }

    public ErrorOr<Success> UpdateStatus(bool newStatus)
    {
        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new StoreStatusUpdatedEvent(Id, newStatus));
        return Result.Success;
    }

    private static bool IsNotValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }
    private Store() {}
}