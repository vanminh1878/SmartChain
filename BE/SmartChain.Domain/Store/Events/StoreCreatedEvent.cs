using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Store.Events;

public record StoreCreatedEvent(Guid StoreId, string Name, Guid OwnerId) : IDomainEvent;