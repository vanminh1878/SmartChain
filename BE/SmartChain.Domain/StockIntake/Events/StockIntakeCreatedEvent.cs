using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.StockIntake.Events;

public record StockIntakeCreatedEvent(Guid StockIntakeId, Guid CreatedBy) : IDomainEvent;