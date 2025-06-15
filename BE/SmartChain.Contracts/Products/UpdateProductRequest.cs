namespace SmartChain.Contracts.Products;

public record UpdateProductRequest(string? name, string? description, decimal? price, string? Image);