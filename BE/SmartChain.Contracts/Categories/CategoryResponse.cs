namespace SmartChain.Contracts.Categories;

public record CategoryResponse(
    Guid Id,
    string Name,
    bool? Status,
    DateTime CreatedAt,
    DateTime? UpdatedAt);