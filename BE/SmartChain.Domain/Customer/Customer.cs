using System;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.Customer.Events;

namespace SmartChain.Domain.Customer;

public class Customer : Entity
{
    public string Fullname { get; private set; }
    public string Email { get; private set; }
    public string PhoneNumber { get; private set; }
    public string Address { get; private set; }
    public bool? Status { get; private set; } // true: active, false: locked
    public Guid StoreId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Customer(string fullname, string email, string phoneNumber, string address, Guid storeId, Guid? id = null) : base(id)
    {
        if (string.IsNullOrEmpty(fullname))
        {
            throw new ArgumentException("Fullname cannot be empty.");
        }
        if (string.IsNullOrEmpty(email))
        {
            throw new ArgumentException("Email cannot be empty.");
        }
        if (!IsValidEmail(email))
        {
            throw new ArgumentException("Invalid email format.");
        }
        if (storeId == Guid.Empty)
        {
            throw new ArgumentException("Store ID cannot be empty.");
        }

        Fullname = fullname;
        Email = email;
        PhoneNumber = phoneNumber ?? string.Empty;
        Address = address ?? string.Empty;
        Status = true; // Default: active
        StoreId = storeId;
        CreatedAt = DateTime.UtcNow;

        _domainEvents.Add(new CustomerCreatedEvent(id ?? Guid.NewGuid(), fullname, storeId));
    }

    public ErrorOr<Success> Update(string fullname, string email, string phoneNumber, string address)
    {
        if (string.IsNullOrEmpty(fullname))
        {
            return Error.Failure("Fullname cannot be empty.");
        }
        if (string.IsNullOrEmpty(email))
        {
            return Error.Failure("Email cannot be empty.");
        }
        if (!IsValidEmail(email))
        {
            return Error.Failure("Invalid email format.");
        }

        Fullname = fullname;
        Email = email;
        PhoneNumber = phoneNumber ?? string.Empty;
        Address = address ?? string.Empty;
        UpdatedAt = DateTime.UtcNow;

        _domainEvents.Add(new CustomerUpdatedEvent(Id, fullname));
        return Result.Success;
    }

    public ErrorOr<Success> UpdateStatus(bool newStatus)
    {
        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new CustomerStatusUpdatedEvent(Id, newStatus));
        return Result.Success;
    }

    private static bool IsValidEmail(string email)
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
    private Customer() {}
}