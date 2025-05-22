using SmartChain.Domain.Common;

namespace SmartChain.Domain.Supplier.Events;

public record SupplierUpdatedEvent (string Name, string Contact_Name, string PhoneNumber, string Email, string Address): IDomainEvent;