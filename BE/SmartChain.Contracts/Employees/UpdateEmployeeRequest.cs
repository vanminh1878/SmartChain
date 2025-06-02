namespace SmartChain.Contracts.Employees;

public record UpdateEmployeeRequest(
    Guid? StoreId,
    string? fullname,
     string? email,
      string? phoneNumber,
      DateTime? birthday,
      string? address,
      bool? sex,
      string? avatar);