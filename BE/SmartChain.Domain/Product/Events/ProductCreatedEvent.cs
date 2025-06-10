using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Product.Events;

public record ProductCreatedEvent(Guid ProductId, string Name, Guid CategoryId) : IDomainEvent;