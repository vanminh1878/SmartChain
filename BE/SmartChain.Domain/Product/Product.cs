using System;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.Product.Events;

namespace SmartChain.Domain.Product;

public class Product : Entity
{
    public string Name { get; private set; }
    public string Description { get; private set; }
    public decimal? Price { get; private set; }
    public int StockQuantity { get; private set; }
    public Guid CategoryId { get; private set; }
    public string? Image { get; private set; } // nvarchar(500)
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Product(string name, string description, Guid categoryId, string? image = null, Guid? id = null) : base(id)
    {
        if (string.IsNullOrEmpty(name))
        {
            throw new ArgumentException("Product name cannot be empty.");
        }
   
        if (categoryId == Guid.Empty)
        {
            throw new ArgumentException("Category ID cannot be empty.");
        }

        Name = name;
        Description = description ?? string.Empty;
        CategoryId = categoryId;
        Image = image ?? null;
        CreatedAt = DateTime.UtcNow;
        StockQuantity = 0;
        _domainEvents.Add(new ProductCreatedEvent(id ?? Guid.NewGuid(), name, categoryId));
    }

    public ErrorOr<Success> Update(string name, string description, decimal price, string? image = null)
    {
        if (string.IsNullOrEmpty(name))
        {
            return Error.Failure("Product name cannot be empty.");
        }
       
        if (image != null && image.Length > 500)
        {
            return Error.Failure("Image URL cannot exceed 500 characters.");
        }

        Name = name;
        Description = description ?? string.Empty;
        Price = price;
       
        Image = image ?? Image;
        UpdatedAt = DateTime.UtcNow;

        return Result.Success;
    }

    public ErrorOr<Success> UpdateStockQuantity(int newStockQuantity)
    {
        StockQuantity += newStockQuantity;
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new ProductStockUpdatedEvent(Id, newStockQuantity));
        return Result.Success;
    }

    private Product() { }
}