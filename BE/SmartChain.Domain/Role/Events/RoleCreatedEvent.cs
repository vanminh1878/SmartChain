using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Role.Events;

public record RoleCreatedEvent(Guid RoleId, string Name) : IDomainEvent;