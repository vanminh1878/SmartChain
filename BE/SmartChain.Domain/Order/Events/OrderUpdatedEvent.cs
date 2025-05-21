using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Order.Events;

public record OrderUpdatedEvent(Guid OrderId, Guid ProductId, int Quantity, decimal UnitPrice) : IDomainEvent;