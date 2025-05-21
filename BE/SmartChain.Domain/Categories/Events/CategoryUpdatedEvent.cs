using System;
using SmartChain.Domain.Common;
namespace SmartChain.Domain.Categories.Events;

public class CategoryUpdatedEvent : IDomainEvent
    {
        public Guid CategoryId { get; }
        public string NewName { get; }
        public bool NewStatus { get; }

        public CategoryUpdatedEvent(Guid categoryId, string newName, bool newStatus)
        {
            CategoryId = categoryId;
            NewName = newName;
            NewStatus = newStatus;
        }
    }