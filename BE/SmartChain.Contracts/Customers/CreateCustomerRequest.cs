namespace SmartChain.Contracts.Customers;

public record CreateCustomerRequest(
    Guid StoreId,
    string fullname,
     string email,
      string phoneNumber,
      string address,
      Guid accountId);