namespace SmartChain.Contracts.Products;

public record ProductResponse(
    Guid Id,
    string Name,
    decimal? Price,
    string? Image
);

public record GetProductsResponse(
    List<ProductResponse> Items
);