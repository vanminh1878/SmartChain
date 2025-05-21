using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Categories.Events;

public record CategoryDeletedEvent(Guid CategoryId, bool NewStatus) : IDomainEvent;