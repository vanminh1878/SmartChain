using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Order.Events;

public record OrderStatusUpdatedEvent(Guid OrderId, string NewStatus) : IDomainEvent;