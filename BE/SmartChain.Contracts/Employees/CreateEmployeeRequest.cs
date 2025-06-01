namespace SmartChain.Contracts.Employees;

public record CreateEmployeeRequest(
    string Fullname,
    string Email,
    string PhoneNumber,
    DateTime Birthday,
    string Address,
    bool Sex,
    string Avatar,
    Guid RoleId,
    string Username,
    string Password,
    Guid StoreId);