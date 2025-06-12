namespace SmartChain.Contracts.Customers;

public record CustomerResponse(
    Guid Id,
    DateTime CreatedAt,
    DateTime? UpdatedAt);