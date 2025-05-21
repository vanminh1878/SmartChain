using System;
using System.Collections.Generic;
using System.Linq;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.Order.Events;

namespace SmartChain.Domain.Order;

public class Order : Entity
{
    public Guid CustomerId { get; private set; }
    public Guid StoreId { get; private set; }
    public decimal TotalAmount { get; private set; }
    public string Status { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    private readonly List<OrderDetail> _orderDetails = new List<OrderDetail>();
    public IReadOnlyList<OrderDetail> OrderDetails => _orderDetails.AsReadOnly();

    public Order(Guid customerId, Guid storeId, Guid? id = null) : base(id)
    {
        if (customerId == Guid.Empty)
        {
            throw new ArgumentException("Customer ID cannot be empty.");
        }
        if (storeId == Guid.Empty)
        {
            throw new ArgumentException("Store ID cannot be empty.");
        }

        CustomerId = customerId;
        StoreId = storeId;
        Status = "pending";
        TotalAmount = 0m;
        CreatedAt = DateTime.UtcNow;
        _domainEvents.Add(new OrderCreatedEvent(id ?? Guid.NewGuid(), customerId, storeId));
    }

    public ErrorOr<Success> AddOrderDetail(Guid productId, int quantity, decimal unitPrice)
    {
        if (Status != "pending")
        {
            return Error.Conflict("Cannot modify order after status is no longer pending.");
        }
        if (productId == Guid.Empty)
        {
            return Error.Failure("Product ID cannot be empty.");
        }
        if (quantity <= 0)
        {
            return Error.Failure("Quantity must be greater than zero.");
        }
        if (unitPrice < 0)
        {
            return Error.Failure("Unit price cannot be negative.");
        }

        var orderDetail = _orderDetails.FirstOrDefault(od => od.ProductId == productId);
        if (orderDetail != null)
        {
            // Cập nhật số lượng nếu sản phẩm đã tồn tại
            orderDetail.UpdateQuantity(orderDetail.Quantity + quantity);
        }
        else
        {
            // Thêm mục mới
            orderDetail = new OrderDetail(productId, quantity, unitPrice);
            _orderDetails.Add(orderDetail);
        }

        UpdateTotalAmount();
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new OrderUpdatedEvent(Id, productId, quantity, unitPrice));
        return Result.Success;
    }

    public ErrorOr<Success> UpdateOrderDetail(Guid productId, int newQuantity)
    {
        if (Status != "pending")
        {
            return Error.Conflict("Cannot modify order after status is no longer pending.");
        }
        if (newQuantity <= 0)
        {
            return Error.Failure("Quantity must be greater than zero.");
        }

        var orderDetail = _orderDetails.FirstOrDefault(od => od.ProductId == productId);
        if (orderDetail == null)
        {
            return Error.NotFound("Product not found in order.");
        }

        orderDetail.UpdateQuantity(newQuantity);
        UpdateTotalAmount();
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new OrderUpdatedEvent(Id, productId, newQuantity, orderDetail.UnitPrice));
        return Result.Success;
    }

    public ErrorOr<Success> RemoveOrderDetail(Guid productId)
    {
        if (Status != "pending")
        {
            return Error.Conflict("Cannot modify order after status is no longer pending.");
        }

        var orderDetail = _orderDetails.FirstOrDefault(od => od.ProductId == productId);
        if (orderDetail == null)
        {
            return Error.NotFound("Product not found in order.");
        }

        _orderDetails.Remove(orderDetail);
        UpdateTotalAmount();
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new OrderUpdatedEvent(Id, productId, 0, 0));
        return Result.Success;
    }

    public ErrorOr<Success> UpdateStatus(string newStatus)
    {
        if (!new[] { "pending", "confirmed", "cancelled" }.Contains(newStatus))
        {
            return Error.Failure("Invalid status. Allowed values: pending, confirmed, cancelled.");
        }
        if (Status == "confirmed" && newStatus == "pending")
        {
            return Error.Conflict("Cannot revert confirmed order to pending.");
        }
        if (Status == "cancelled")
        {
            return Error.Conflict("Cannot modify a cancelled order.");
        }

        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(newStatus == "cancelled"
            ? new OrderCancelledEvent(Id)
            : new OrderStatusUpdatedEvent(Id, newStatus));
        return Result.Success;
    }

    public ErrorOr<decimal> CalculateTotal()
    {
        if (!_orderDetails.Any())
        {
            return 0m;
        }

        decimal total = _orderDetails.Sum(od => od.Quantity * od.UnitPrice);
        return total;
    }

    private void UpdateTotalAmount()
    {
        TotalAmount = _orderDetails.Sum(od => od.Quantity * od.UnitPrice);
    }
}