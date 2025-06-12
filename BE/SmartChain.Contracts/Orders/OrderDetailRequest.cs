namespace SmartChain.Contracts.Orders;
public record OrderDetailRequest(
    Guid ProductId,
    int Quantity
);
