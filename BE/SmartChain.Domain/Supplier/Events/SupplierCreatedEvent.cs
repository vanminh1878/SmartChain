using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Supplier.Events;

public record SupplierCreatedEvent(Guid SupplierId, string Name, string Contact_Name, string PhoneNumber, string Email, string Address, Guid StoreId) : IDomainEvent;