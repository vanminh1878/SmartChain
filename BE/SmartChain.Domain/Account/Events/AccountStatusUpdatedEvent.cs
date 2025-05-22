using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Account.Events;

public record AccountStatusUpdatedEvent(Guid AccountId, bool Status) : IDomainEvent;