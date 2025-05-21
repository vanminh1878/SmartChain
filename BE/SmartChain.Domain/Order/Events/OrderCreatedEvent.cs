using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Order.Events;

public record OrderCreatedEvent(Guid OrderId, Guid CustomerId, Guid StoreId) : IDomainEvent;