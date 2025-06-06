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
    public decimal? Latitude { get; private set; } // decimal(9,6)
    public decimal? Longitude { get; private set; } // decimal(9,6)
    public string? Image { get; private set; } // nvarchar(500)
    public Guid OwnerId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Store(string name, string address, string phoneNumber, string email, Guid ownerId,
                 decimal? latitude, decimal? longitude, string? image, Guid? id = null) : base(id)
    {
        if (string.IsNullOrEmpty(name))
        {
            throw new ArgumentException("Store name cannot be empty.");
        }
        if (string.IsNullOrEmpty(email))
        {
            throw new ArgumentException("Email cannot be empty.");
        }
        if (ownerId == Guid.Empty)
        {
            throw new ArgumentException("Owner ID cannot be empty.");
        }
        if (latitude.HasValue && (latitude.Value < -90 || latitude.Value > 90))
        {
            throw new ArgumentException("Latitude must be between -90 and 90.");
        }
        if (longitude.HasValue && (longitude.Value < -180 || longitude.Value > 180))
        {
            throw new ArgumentException("Longitude must be between -180 and 180.");
        }
        if (image != null && image.Length > 500)
        {
            throw new ArgumentException("Image URL cannot exceed 500 characters.");
        }

        Name = name;
        Address = address ?? string.Empty;
        PhoneNumber = phoneNumber ?? string.Empty;
        Email = email;
        Status = true; // Default: active
        Latitude = latitude;
        Longitude = longitude;
        Image = image;
        OwnerId = ownerId;
        CreatedAt = DateTime.UtcNow;

        _domainEvents.Add(new StoreCreatedEvent(id ?? Guid.NewGuid(), name, ownerId));
    }

    public ErrorOr<Success> Update(string name, string address, string phoneNumber, string email,Guid ownerId,
                                   decimal? latitude, decimal? longitude, string? image)
    {
        if (string.IsNullOrEmpty(name))
        {
            return Error.Failure("Store name cannot be empty.");
        }
        if (string.IsNullOrEmpty(email))
        {
            return Error.Failure("Email cannot be empty.");
        }
        if (latitude.HasValue && (latitude.Value < -90 || latitude.Value > 90))
        {
            return Error.Failure("Latitude must be between -90 and 90.");
        }
        if (longitude.HasValue && (longitude.Value < -180 || longitude.Value > 180))
        {
            return Error.Failure("Longitude must be between -180 and 180.");
        }
        if (image != null && image.Length > 500)
        {
            return Error.Failure("Image URL cannot exceed 500 characters.");
        }

        Name = name;
        Address = address ?? Address;
        PhoneNumber = phoneNumber ?? PhoneNumber;
        Email = email;
        Latitude = latitude;
        Longitude = longitude;
        Image = image;
        OwnerId = ownerId;
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

    private Store() { }
}