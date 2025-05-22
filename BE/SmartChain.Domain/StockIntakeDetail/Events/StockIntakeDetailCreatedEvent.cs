using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.StockIntake.Events;

public record StockIntakeDetailCreatedEvent(Guid StockIntakeDetailId, Guid ProductId, int Quantity, decimal UnitPrice) : IDomainEvent;