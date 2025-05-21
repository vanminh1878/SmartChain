using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Customer.Events;

public record CustomerStatusUpdatedEvent(Guid CustomerId, bool Status) : IDomainEvent;