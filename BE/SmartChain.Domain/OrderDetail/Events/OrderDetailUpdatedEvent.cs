using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Order.Events;

public record OrderDetailUpdatedEvent(Guid OrderDetailId, Guid ProductId, int Quantity, decimal UnitPrice) : IDomainEvent;