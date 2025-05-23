namespace SmartChain.Contracts.Categories;

public record CategoryResponse(
    Guid Id,
    string Name,
    Guid StoreId,
    bool? Status,
    DateTime CreatedAt,
    DateTime? UpdatedAt);