namespace SmartChain.Contracts.User;

public record CreateUserRequest(string fullname, string email, string phoneNumber, DateTime birthday, string address, bool sex, string avatar, Guid accountId,Guid roleId);