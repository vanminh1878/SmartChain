namespace SmartChain.Contracts.Orders;
public record CreateOrderRequest(
    Guid? CustomerId,
    Guid StoreId,
    Guid CartId,
    List<OrderDetailRequest> OrderDetails
);

