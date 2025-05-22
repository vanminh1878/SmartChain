using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.User.Events;

public record UserCreatedEvent(Guid UserId, string Fullname, string Email, Guid AccountId, Guid RoleId) : IDomainEvent;