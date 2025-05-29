namespace SmartChain.Contracts.Users;

public record UpdateUserRequest(string fullname, string email, string phoneNumber, DateTime birthday, string address, bool sex, string avatar);