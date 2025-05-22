using System;
using System.Collections.Concurrent;
using System.ComponentModel.Design;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.Supplier.Events;

namespace SmartChain.Domain.Supplier;

public class Supplier : Entity
{
    public string Name { get; private set; }
    public string Contact_name { get; private set; }
    public string PhoneNumber { get; private set; }
    public string Email { get; private set; }
    public string Address { get; private set; }
    public bool? Status { get; private set; }
    public Guid StoreId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Supplier(string name, string contact_Name, string phoneNumber, string email, string address, Guid storeId, Guid? id = null) : base(id)
    {
        if (string.IsNullOrEmpty(name))
        {
            throw new ArgumentException("Supplier's name cannot be null");
        }
        if (string.IsNullOrEmpty(contact_Name))
        {
            throw new ArgumentException("Contact name cannot be null");
        }
        if (string.IsNullOrEmpty(phoneNumber))
        {
            throw new ArgumentException("Phone Number cannot be null");
        }
        if (string.IsNullOrEmpty(email))
        {
            throw new ArgumentException("Email cannot be null");
        }
        if (string.IsNullOrEmpty(address))
        {
            throw new ArgumentException("Address cannot be null");
        }
        if (storeId == Guid.Empty)
        {
            throw new ArgumentException("Store ID cannot be empty.");
        }
        Name = name;
        Contact_name = contact_Name;
        PhoneNumber = phoneNumber;
        Email = email;
        Address = address;
        Status = true;
        StoreId = storeId;
        CreatedAt = DateTime.UtcNow;
        _domainEvents.Add(new SupplierCreatedEvent(id ?? Guid.NewGuid(), name, contact_Name, phoneNumber, address, email,storeId));
    }

    public ErrorOr<Success> Update(string newName, string newContactName, string newPhoneNumber, string newEmail, string newAddress)
    {
        if (string.IsNullOrEmpty(newName))
        {
            return Error.Failure("Supplier's name cannot be empty");
        }
        if (string.IsNullOrEmpty(newContactName))
        {
            return Error.Failure("Contact name cannot be empty");
        }
        if (string.IsNullOrEmpty(newPhoneNumber))
        {
            return Error.Failure("Phone Number cannot be empty");
        }
        if (string.IsNullOrEmpty(newAddress))
        {
            return Error.Failure("Address cannot be empty");
        }
        if (string.IsNullOrEmpty(newEmail))
        {
            return Error.Failure("Email cannot be empty");
        }
        if (!IsValidEmail(newEmail))
        {
            return Error.Failure("Invalid email format");
        }
        Name = newName;
        Contact_name = newContactName;
        PhoneNumber = newPhoneNumber;
        Email = newEmail;
        Address = newAddress;

        _domainEvents.Add(new SupplierUpdatedEvent(newName, newContactName, newPhoneNumber, newAddress, newEmail));
        return Result.Success;
    }

    public ErrorOr<Success> UpdateStatus(bool newStatus)
    {
        Status = newStatus;

        _domainEvents.Add(new SupplierStatusUpdatedEvent(newStatus));
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
    private Supplier() {}
}