using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Product.Events;

public record ProductUpdatedEvent(Guid ProductId, string Name, Guid CategoryId) : IDomainEvent;