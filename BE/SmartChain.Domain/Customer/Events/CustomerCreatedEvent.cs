using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Customer.Events;

public record CustomerCreatedEvent(Guid CustomerId, string Fullname, Guid StoreId) : IDomainEvent;