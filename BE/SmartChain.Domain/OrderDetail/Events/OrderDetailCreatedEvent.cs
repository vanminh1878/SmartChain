using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Order.Events;

public record OrderDetailCreatedEvent(Guid OrderDetailId, Guid ProductId, int Quantity, decimal UnitPrice) : IDomainEvent;