using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.User.Events;

public record UserUpdatedEvent(Guid UserId, string Fullname, string Email) : IDomainEvent;