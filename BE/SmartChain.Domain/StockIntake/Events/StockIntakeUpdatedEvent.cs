using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.StockIntake.Events;

public record StockIntakeUpdatedEvent(Guid StockIntakeId, Guid ProductId, int Quantity, decimal UnitPrice) : IDomainEvent;