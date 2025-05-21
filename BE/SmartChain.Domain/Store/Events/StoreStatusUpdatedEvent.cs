using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Store.Events;

public record StoreStatusUpdatedEvent(Guid StoreId, bool Status) : IDomainEvent;