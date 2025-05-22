using SmartChain.Domain.Common;

namespace SmartChain.Domain.Supplier.Events;

public record SupplierStatusUpdatedEvent(bool Status):IDomainEvent;