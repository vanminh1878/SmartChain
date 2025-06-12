namespace SmartChain.Contracts.Customers;

public record UpdateCustomerRequest(
    Guid? StoreId,
    string? fullname,
     string? email,
      string? phoneNumber,
      DateTime? birthday,
      string? address,
      bool? sex,
      string? avatar);