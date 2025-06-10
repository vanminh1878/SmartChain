using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.Categories.Events;
using System;

namespace SmartChain.Domain.Categories
{
    public class Category : Entity
    {
        public string Name { get; private set; }
        public bool? Status { get; private set; }
        public string? Image { get; private set; } // nvarchar(500)
        public DateTime CreatedAt { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

        public Category(string name, string? image = null, Guid? id = null) : base(id)
        {
            if (string.IsNullOrEmpty(name))
            {
                throw new ArgumentException("Category name cannot be null or empty.");
            }
            
            if (image != null && image.Length > 500)
            {
                throw new ArgumentException("Image URL cannot exceed 500 characters.");
            }

            Name = name;
            Status = true;
            Image = image;
            CreatedAt = DateTime.UtcNow;

        
        }

        public ErrorOr<Success> Update(string newName, bool newStatus, string? image = null)
        {
            if (string.IsNullOrEmpty(newName))
            {
                return Error.Failure("Category name cannot be null or empty.");
            }
            
            if (image != null && image.Length > 500)
            {
                return Error.Failure("Image URL cannot exceed 500 characters.");
            }

            Name = newName;
            Status = newStatus;
            Image = image ?? Image;
            UpdatedAt = DateTime.UtcNow;

            _domainEvents.Add(new CategoryUpdatedEvent(Id, newName, newStatus));
            return Result.Success;
        }

        public ErrorOr<Success> DeletedStatus(bool newStatus)
        {
            Status = newStatus;
            UpdatedAt = DateTime.UtcNow;
            _domainEvents.Add(new CategoryDeletedEvent(Id, newStatus));
            return Result.Success;
        }

        private Category() { }
    }
}