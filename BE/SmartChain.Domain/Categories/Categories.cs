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
        public decimal? Profit_margin { get; private set; } // decimal(5,2), default: 0.30
        public string? Image { get; private set; } // varchar(500)
        public DateTime CreatedAt { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

        public Category(string name, decimal? profitMargin = null, string? image = null, Guid? id = null) : base(id)
        {
            if (string.IsNullOrEmpty(name))
            {
                throw new ArgumentException("Category name cannot be null or empty.");
            }
            if (profitMargin.HasValue && (profitMargin.Value < 0 || profitMargin.Value > 100))
            {
                throw new ArgumentException("Profit margin must be between 0 and 100.");
            }
            if (image != null && image.Length > 500)
            {
                throw new ArgumentException("Image URL cannot exceed 500 characters.");
            }

            Name = name;
            Status = true;
            Profit_margin = profitMargin ?? 0.30m; // Default: 0.30
            Image = image;
            CreatedAt = DateTime.UtcNow;

        
        }

        public ErrorOr<Success> Update(string newName, bool newStatus, decimal? profitMargin = null, string? image = null)
        {
            if (string.IsNullOrEmpty(newName))
            {
                return Error.Failure("Category name cannot be null or empty.");
            }
            if (profitMargin.HasValue && (profitMargin.Value < 0 || profitMargin.Value > 100))
            {
                return Error.Failure("Profit margin must be between 0 and 100.");
            }
            if (image != null && image.Length > 500)
            {
                return Error.Failure("Image URL cannot exceed 500 characters.");
            }

            Name = newName;
            Status = newStatus;
            Profit_margin = profitMargin ?? Profit_margin;
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