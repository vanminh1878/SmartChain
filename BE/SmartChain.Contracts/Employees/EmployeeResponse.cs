namespace SmartChain.Contracts.Employees;

public record EmployeeResponse(
    Guid Id,
    Guid UserId,
    Guid StoreId,
    DateTime CreatedAt,
    DateTime? UpdatedAt);