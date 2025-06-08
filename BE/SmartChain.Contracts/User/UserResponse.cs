namespace SmartChain.Contracts.User;

public record UserResponse(
    Guid Id,
    string fullname,
    string email,
    string phoneNumber,
    DateTime birthday,
    string address,
    bool sex,
    string avatar,
    Guid accountId,
    Guid roleId,
    DateTime CreatedAt,
    DateTime? UpdatedAt);