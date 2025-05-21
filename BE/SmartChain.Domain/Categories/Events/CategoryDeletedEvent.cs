using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Categories.Events;

public class CategoryDeletedEvent : IDomainEvent
{
    public Guid CategoryId { get; }
    public bool NewStatus { get; }

    public CategoryDeletedEvent(Guid categoryId, bool newStatus)
    {
        CategoryId = categoryId;
        NewStatus = newStatus;
    }
}
