using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Order.Events;

public record OrderCancelledEvent(Guid OrderId) : IDomainEvent;