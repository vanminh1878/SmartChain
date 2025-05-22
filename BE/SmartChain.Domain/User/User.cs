using System;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.User.Events;

namespace SmartChain.Domain.User;

public class User : Entity
{
    public string Fullname { get; private set; }
    public string Email { get; private set; }
    public string PhoneNumber { get; private set; }
    public DateTime Birthday { get; private set; }
    public string Address { get; private set; }
    public bool Sex { get; private set; } // false: female, true: male
    public string Avatar { get; private set; }
    public Guid AccountId { get; private set; }
    public Guid RoleId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public User(string fullname, string email, string phoneNumber, DateTime birthday, string address, bool sex, string avatar, Guid accountId, Guid roleId, Guid? id = null) : base(id)
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
        if (accountId == Guid.Empty)
        {
            throw new ArgumentException("Account ID cannot be empty.");
        }
        if (roleId == Guid.Empty)
        {
            throw new ArgumentException("Role ID cannot be empty.");
        }

        Fullname = fullname;
        Email = email;
        PhoneNumber = phoneNumber ?? string.Empty;
        Birthday = birthday;
        Address = address ?? string.Empty;
        Sex = sex;
        Avatar = avatar ?? string.Empty;
        AccountId = accountId;
        RoleId = roleId;
        CreatedAt = DateTime.UtcNow;

        _domainEvents.Add(new UserCreatedEvent(id ?? Guid.NewGuid(), fullname, email, accountId, roleId));
    }

    public ErrorOr<Success> Update(string fullname, string email, string phoneNumber, DateTime birthday, string address, bool sex, string avatar)
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
        Birthday = birthday;
        Address = address ?? string.Empty;
        Sex = sex;
        Avatar = avatar ?? string.Empty;
        UpdatedAt = DateTime.UtcNow;

        _domainEvents.Add(new UserUpdatedEvent(Id, fullname, email));
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
}