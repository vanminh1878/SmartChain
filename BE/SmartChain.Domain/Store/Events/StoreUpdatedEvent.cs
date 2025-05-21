using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Store.Events;

public record StoreUpdatedEvent(Guid StoreId, string Name) : IDomainEvent;