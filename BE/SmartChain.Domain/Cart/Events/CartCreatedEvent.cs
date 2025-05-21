using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Cart.Events;

public record CartCreatedEvent(Guid CartId, Guid CustomerId, Guid StoreId) : IDomainEvent;

