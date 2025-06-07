using System;
using System.Collections.Generic;

namespace SmartChain.Application.StockIntakes.Queries.GetPurchaseOrdersForInventory;

public class SupplierPurchaseOrdersDto
{
    public Guid SupplierId { get; set; }
    public string Supplier { get; set; } = string.Empty;
    public DateTime IntakeDate { get; set; }
    public List<StorePurchaseOrderDto> PurchaseOrders { get; set; } = new List<StorePurchaseOrderDto>();
    public decimal TotalAmount { get; set; } // Đổi sang decimal để giữ độ chính xác
    public class StorePurchaseOrderDto
    {
        public string StoreName { get; set; } = string.Empty;
        public List<ProductDetailDto> Products { get; set; } = new List<ProductDetailDto>();
        public decimal TotalAmountPerStore { get; set; } // Đổi sang decimal để giữ độ chính xác
    }

    public class ProductDetailDto
    {
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }
}