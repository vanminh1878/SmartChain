using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Cart.Events;

public record CartDetailCreatedEvent(Guid CartDetailId, Guid ProductId, int Quantity, decimal UnitPrice) : IDomainEvent;