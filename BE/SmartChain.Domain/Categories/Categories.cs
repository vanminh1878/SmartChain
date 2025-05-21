using ErrorOr;
using SmartChain.Domain.Categories.Events;
using SmartChain.Domain.Common;
using System;

namespace SmartChain.Domain.Categories
{
    public class Category : Entity
    {
        public string Name { get; private set; }
        public Guid StoreId { get; private set; }
        public bool Status { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

        public Category(string name, Guid storeId, Guid? id = null) : base(id)
        {
            if (string.IsNullOrEmpty(name))
            {
                throw new ArgumentException("Category name cannot be null or empty.");
            }
            if (storeId == Guid.Empty)
            {
                throw new ArgumentException("Store ID cannot be empty.");
            }
            Name = name;
            StoreId = storeId;
            Status = false;
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

        public ErrorOr<Success> DeletedStatus()
        {
            if (!Status) // nếu đã bị xoá thì không xoá nữa
            {
                return Error.Conflict("Category was deleted");
            }
            Status = !Status;
            UpdatedAt = DateTime.UtcNow;
            _domainEvents.Add(new CategoryDeletedEvent(Id, Status));
            return Result.Success;
        }
    }
}