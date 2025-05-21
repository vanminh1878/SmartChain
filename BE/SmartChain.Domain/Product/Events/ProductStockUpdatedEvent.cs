using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Product.Events;

public record ProductStockUpdatedEvent(Guid ProductId, int StockQuantity) : IDomainEvent;