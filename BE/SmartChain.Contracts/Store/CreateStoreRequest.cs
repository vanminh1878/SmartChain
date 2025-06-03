namespace SmartChain.Contracts.Stores;

public record CreateStoreRequest(string name, string address, string phoneNumber, string email, Guid ownerId, decimal? latitude, decimal? longitude, string? image);