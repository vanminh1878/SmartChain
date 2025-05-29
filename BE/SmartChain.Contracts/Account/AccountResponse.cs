namespace SmartChain.Contracts.Accounts;

public record AccountResponse(
    Guid Id,
    string Username,
    string Password,
    bool? Status,
    DateTime CreatedAt,
    DateTime? UpdatedAt);