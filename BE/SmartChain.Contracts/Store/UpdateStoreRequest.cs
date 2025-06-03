namespace SmartChain.Contracts.Stores;

public record UpdateStoreRequest(string? name, string? address, string? phoneNumber, string? email,
                                 Guid? ownerId, decimal? latitude, decimal? longitude, string? image);