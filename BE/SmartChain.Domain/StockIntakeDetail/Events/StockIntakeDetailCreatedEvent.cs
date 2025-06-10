using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.StockIntake.Events;

public record StockIntakeDetailCreatedEvent(Guid StockIntakeDetailId,Guid StockIntakeId, Guid SupplierId,Guid StoreId, Guid ProductId, int Quantity, decimal UnitPrice, DateTime IntakeDate, decimal? ProfitMargin) : IDomainEvent;