namespace SmartChain.Contracts.User;

public record UpdateUserRequest(string fullname, string email, string phoneNumber, DateTime birthday, string address, bool sex, string avatar);