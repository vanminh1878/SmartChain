using System;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.Product.Events;

namespace SmartChain.Domain.Product;

public class Product : Entity
{
    public string Name { get; private set; }
    public string Description { get; private set; }
    public decimal Price { get; private set; }
    public int StockQuantity { get; private set; }
    public Guid CategoryId { get; private set; }
    public Guid StoreId { get; private set; }
    public string? Image { get; private set; } // nvarchar(500)
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Product(string name, string description, decimal price, int stockQuantity, Guid categoryId, Guid storeId, string? image = null, Guid? id = null) : base(id)
    {
        if (string.IsNullOrEmpty(name))
        {
            throw new ArgumentException("Product name cannot be empty.");
        }
        if (price < 0)
        {
            throw new ArgumentException("Price cannot be negative.");
        }
        if (stockQuantity < 0)
        {
            throw new ArgumentException("Stock quantity cannot be negative.");
        }
        if (categoryId == Guid.Empty)
        {
            throw new ArgumentException("Category ID cannot be empty.");
        }
        if (storeId == Guid.Empty)
        {
            throw new ArgumentException("Store ID cannot be empty.");
        }
        if (image != null && image.Length > 500)
        {
            throw new ArgumentException("Image URL cannot exceed 500 characters.");
        }

        Name = name;
        Description = description ?? string.Empty;
        Price = price;
        StockQuantity = stockQuantity;
        CategoryId = categoryId;
        StoreId = storeId;
        Image = image;
        CreatedAt = DateTime.UtcNow;

        _domainEvents.Add(new ProductCreatedEvent(id ?? Guid.NewGuid(), name, categoryId, storeId));
    }

    public ErrorOr<Success> Update(string name, string description, decimal price, int stockQuantity, Guid categoryId, string? image = null)
    {
        if (string.IsNullOrEmpty(name))
        {
            return Error.Failure("Product name cannot be empty.");
        }
        if (price < 0)
        {
            return Error.Failure("Price cannot be negative.");
        }
        if (stockQuantity < 0)
        {
            return Error.Failure("Stock quantity cannot be negative.");
        }
        if (categoryId == Guid.Empty)
        {
            return Error.Failure("Category ID cannot be empty.");
        }
        if (image != null && image.Length > 500)
        {
            return Error.Failure("Image URL cannot exceed 500 characters.");
        }

        Name = name;
        Description = description ?? string.Empty;
        Price = price;
        StockQuantity = stockQuantity;
        CategoryId = categoryId;
        Image = image ?? Image;
        UpdatedAt = DateTime.UtcNow;

        _domainEvents.Add(new ProductUpdatedEvent(Id, name, categoryId));
        return Result.Success;
    }

    public ErrorOr<Success> UpdateStockQuantity(int newStockQuantity)
    {
        if (newStockQuantity < 0)
        {
            return Error.Failure("New Stock quantity cannot be negative.");
        }

        StockQuantity += newStockQuantity;
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new ProductStockUpdatedEvent(Id, newStockQuantity));
        return Result.Success;
    }

    private Product() { }
}