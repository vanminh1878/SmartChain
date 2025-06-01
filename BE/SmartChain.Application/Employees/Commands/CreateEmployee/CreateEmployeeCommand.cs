using ErrorOr;
using MediatR;
using SmartChain.Domain.Employee;

namespace SmartChain.Application.Employees.Commands.CreateEmployee;

public record CreateEmployeeCommand(
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
    Guid StoreId) : IRequest<ErrorOr<Employee>>;