using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Role.Events;

public record RoleUpdatedEvent(Guid RoleId, string Name) : IDomainEvent;