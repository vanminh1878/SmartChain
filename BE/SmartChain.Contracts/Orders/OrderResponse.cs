namespace SmartChain.Contracts.Orders;

public record OrderResponse(
    Guid Id,
    Guid? CustomerId,
    Guid StoreId,
    decimal TotalAmount,
    string Status,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    List<OrderDetailResponse> OrderDetails
);
