namespace SmartChain.Contracts.Orders;


public record OrderDetailResponse(
    Guid ProductId,
    int Quantity,
    decimal Price
);
