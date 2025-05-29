namespace SmartChain.Contracts.Stores;

public record CreateStoreRequest(string name, string address, string phoneNumber, string email, Guid ownerId);