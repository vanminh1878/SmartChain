namespace SmartChain.Contracts.Supplier;

public record SupplierResponse(
    Guid Id,
    string Name,
    string contact_Name,
    string PhoneNumber,
    string Email,
    string Address,
    DateTime CreatedAt,
    DateTime? UpdatedAt);