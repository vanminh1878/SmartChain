using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Account.Events;

public record AccountCreatedEvent(Guid AccountId, string Username) : IDomainEvent;