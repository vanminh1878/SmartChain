using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.StockIntake.Events;

public record StockIntakeDetailUpdatedEvent(Guid StockIntakeDetailId, Guid ProductId, int Quantity, decimal UnitPrice) : IDomainEvent;