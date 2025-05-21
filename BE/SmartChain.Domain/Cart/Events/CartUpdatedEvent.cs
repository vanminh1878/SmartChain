using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Cart.Events;

public record CartUpdatedEvent(Guid CartId, Guid ProductId, int Quantity, decimal UnitPrice) : IDomainEvent;