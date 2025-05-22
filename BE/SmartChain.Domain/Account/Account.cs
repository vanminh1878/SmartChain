using System;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.Account.Events;

namespace SmartChain.Domain.Account;

public class Account : Entity
{
    public string Username { get; private set; }
    public string Password { get; private set; }
    public bool? Status { get; private set; } // true: active, false: locked
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Account(string username, string password, Guid? id = null) : base(id)
    {
        if (string.IsNullOrEmpty(username))
        {
            throw new ArgumentException("Username cannot be empty.");
        }
        if (username.Length > 50)
        {
            throw new ArgumentException("Username cannot exceed 50 characters.");
        }
        if (string.IsNullOrEmpty(password))
        {
            throw new ArgumentException("Password cannot be empty.");
        }

        Username = username;
        Password = password;
        Status = true; // Default: active
        CreatedAt = DateTime.UtcNow;

        _domainEvents.Add(new AccountCreatedEvent(id ?? Guid.NewGuid(), username));
    }

    public ErrorOr<Success> UpdateUsername(string newUsername)
    {
        if (string.IsNullOrEmpty(newUsername))
        {
            return Error.Failure("Username cannot be empty.");
        }
        if (newUsername.Length > 50)
        {
            return Error.Failure("Username cannot exceed 50 characters.");
        }

        Username = newUsername;
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new AccountUpdatedEvent(Id, newUsername));
        return Result.Success;
    }

    public ErrorOr<Success> UpdatePassword(string newPassword)
    {
        if (string.IsNullOrEmpty(newPassword))
        {
            return Error.Failure("Password cannot be empty.");
        }

        Password = newPassword;
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new AccountUpdatedEvent(Id, Username));
        return Result.Success;
    }

    public ErrorOr<Success> UpdateStatus(bool newStatus)
    {
        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new AccountStatusUpdatedEvent(Id, newStatus));
        return Result.Success;
    }
    private Account() {}
}