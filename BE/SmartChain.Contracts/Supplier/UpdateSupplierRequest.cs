namespace SmartChain.Contracts.Supplier;

public record UpdateSupplierRequest(
    string Name,
    string Contact_Name,
    string PhoneNumber,
    string Email,
    string Address);