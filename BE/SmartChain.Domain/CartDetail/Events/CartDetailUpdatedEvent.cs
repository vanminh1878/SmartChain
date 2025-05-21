using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Cart.Events;

public record CartDetailUpdatedEvent(Guid CartDetailId, Guid ProductId, int Quantity, decimal UnitPrice) : IDomainEvent;