using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Customer.Events;

public record CustomerUpdatedEvent(Guid CustomerId, string Fullname) : IDomainEvent;