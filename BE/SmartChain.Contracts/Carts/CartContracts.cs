namespace SmartChain.Contracts.Carts;

public record CartResponse(
    Guid Id,
    Guid? CustomerId,
    Guid StoreId,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    List<CartDetailResponse> CartDetails
);

public record CartDetailResponse(
    Guid ProductId,
    int Quantity,
    decimal Price
);

public record CreateCartRequest(
    Guid? CustomerId,
    Guid StoreId,
    Guid ProductId,
    int Quantity
);

public record UpdateCartDetailRequest(
    Guid ProductId,
    int Quantity
);