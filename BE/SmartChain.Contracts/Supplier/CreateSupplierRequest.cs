namespace SmartChain.Contracts.Supplier;

public record CreateSupplierRequest(
    string Name,
    string Contact_Name,
    string PhoneNumber,
    string Email,
    string Address,
    decimal? Latitude,
    decimal? Longitude,
    string? Image);