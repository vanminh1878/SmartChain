using ErrorOr;
using SmartChain.Domain.Categories.Events;
using SmartChain.Domain.Common;
using System;

namespace SmartChain.Domain.Categories
{
    public class Category : Entity
    {
        public string Name { get; private set; }
        public bool? Status { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

        public Category(string name, Guid? id = null) : base(id)
        {
            if (string.IsNullOrEmpty(name))
            {
                throw new ArgumentException("Category name cannot be null or empty.");
            }
            Name = name;
            Status = true;
            CreatedAt = DateTime.UtcNow;
        }

        public ErrorOr<Success> Update(string newname, bool newstatus)
        {
            if (string.IsNullOrEmpty(newname))
            {
                return Error.Failure("Category name cannot be null or empty.");
            }
            Name = newname;
            Status = newstatus;
            UpdatedAt = DateTime.UtcNow;

            _domainEvents.Add(new CategoryUpdatedEvent(Id, newname, newstatus));

            return Result.Success;
        }

        public ErrorOr<Success> DeletedStatus(bool newStatus)
        {
            Status = newStatus;
            UpdatedAt = DateTime.UtcNow;
            _domainEvents.Add(new CategoryDeletedEvent(Id, newStatus));
            return Result.Success;
        }
        private Category() {}
    }
    
}