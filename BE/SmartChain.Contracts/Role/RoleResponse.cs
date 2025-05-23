namespace SmartChain.Contracts.Roles;

public record RoleResponse(
    Guid Id,
    string Name,
    DateTime CreatedAt,
    DateTime? UpdatedAt);