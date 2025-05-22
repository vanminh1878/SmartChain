using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Account.Events;

public record AccountUpdatedEvent(Guid AccountId, string Username) : IDomainEvent;