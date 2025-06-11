namespace SmartChain.Contracts.Stores;

public record StoreResponse(
    Guid Id,
    string Name,
    string Address,
    string PhoneNumber,
    string Email,
    bool? Status, // true: active, false: locked
    DateTime CreatedAt,
    DateTime? UpdatedAt);