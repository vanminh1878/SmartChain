using System;
using System.Collections.Generic;
using System.Linq;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.StockIntake.Events;

namespace SmartChain.Domain.StockIntake;

public class StockIntake : Entity
{
    
    public int Status { get; private set; } // 0: pending, 1: approved
    public Guid CreatedBy { get; private set; }
    public Guid? ApprovedBy { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    private readonly List<StockIntakeDetail> _stockIntakeDetails = new List<StockIntakeDetail>();
    public IReadOnlyList<StockIntakeDetail> StockIntakeDetails => _stockIntakeDetails.AsReadOnly();

    public StockIntake( Guid createdBy, Guid? id = null) : base(id)
    {
        
        if (createdBy == Guid.Empty)
        {
            throw new ArgumentException("CreatedBy ID cannot be empty.");
        }

        
        
        Status = 0; // 0 = pending
        CreatedBy = createdBy;
        ApprovedBy = null; // Mới tạo, chưa có người phê duyệt
        CreatedAt = DateTime.UtcNow;

        _domainEvents.Add(new StockIntakeCreatedEvent(id ?? Guid.NewGuid(), createdBy));
    }

    public ErrorOr<Success> AddStockIntakeDetail(Guid productId,Guid supplierId, Guid storeId, int quantity, decimal unitPrice,DateTime intakeDate, decimal? profitMargin = null)
    {
        if (Status != 0)
        {
            return Error.Conflict("Cannot modify stock intake after status is no longer pending.");
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

        var stockIntakeDetail = _stockIntakeDetails.FirstOrDefault(sid => sid.ProductId == productId);
        if (stockIntakeDetail != null)
        {
            // Cập nhật số lượng nếu sản phẩm đã tồn tại
            stockIntakeDetail.UpdateQuantity(stockIntakeDetail.Quantity + quantity);
        }
        else
        {
            // Thêm mục mới
            stockIntakeDetail = new StockIntakeDetail(Id,supplierId,storeId, productId, quantity, unitPrice,intakeDate,profitMargin);
            _stockIntakeDetails.Add(stockIntakeDetail);
        }

        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new StockIntakeUpdatedEvent(Id, productId, quantity, unitPrice));
        return Result.Success;
    }
      public ErrorOr<Success> UpdateStatus(int newStatus)
    {



        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
        return Result.Success;
    }



    public ErrorOr<Success> UpdateStockIntakeDetail(Guid productId, int newQuantity)
    {
        if (Status != 0)
        {
            return Error.Conflict("Cannot modify stock intake after status is no longer pending.");
        }
        if (newQuantity <= 0)
        {
            return Error.Failure("Quantity must be greater than zero.");
        }

        var stockIntakeDetail = _stockIntakeDetails.FirstOrDefault(sid => sid.ProductId == productId);
        if (stockIntakeDetail == null)
        {
            return Error.NotFound("Product not found in stock intake.");
        }

        stockIntakeDetail.UpdateQuantity(newQuantity);
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new StockIntakeUpdatedEvent(Id, productId, newQuantity, stockIntakeDetail.UnitPrice));
        return Result.Success;
    }

    public ErrorOr<Success> RemoveStockIntakeDetail(Guid productId)
    {
        if (Status != 0)
        {
            return Error.Conflict("Cannot modify stock intake after status is no longer pending.");
        }

        var stockIntakeDetail = _stockIntakeDetails.FirstOrDefault(sid => sid.ProductId == productId);
        if (stockIntakeDetail == null)
        {
            return Error.NotFound("Product not found in stock intake.");
        }

        _stockIntakeDetails.Remove(stockIntakeDetail);
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new StockIntakeUpdatedEvent(Id, productId, 0, 0));
        return Result.Success;
    }

    public ErrorOr<Success> Approve(Guid approvedBy)
    {
        if (Status == 1)
        {
            return Error.Conflict("Stock intake is already approved.");
        }
        if (approvedBy == Guid.Empty)
        {
            return Error.Failure("ApprovedBy ID cannot be empty.");
        }

        Status = 1; // 1 = approved
        ApprovedBy = approvedBy;
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new StockIntakeApprovedEvent(Id, approvedBy));
        return Result.Success;
    }

    public ErrorOr<decimal> CalculateTotal()
    {
        if (!_stockIntakeDetails.Any())
        {
            return 0m;
        }

        decimal total = _stockIntakeDetails.Sum(sid => sid.Quantity * sid.UnitPrice);
        return total;
    }
    private StockIntake() {}
}