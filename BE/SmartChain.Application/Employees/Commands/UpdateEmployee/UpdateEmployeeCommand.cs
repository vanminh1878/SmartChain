using ErrorOr;
using MediatR;
using SmartChain.Domain.Employee;

namespace SmartChain.Application.Employees.Commands.UpdateEmployee;

public record UpdateEmployeeCommand(
    Guid Id,
    Guid? StoreId,
    string? fullname, // Cho phép null
    string? email,   // Cho phép null
    string? phoneNumber, // Cho phép null
    DateTime? birthday,
    string? address,  // Cho phép null
    bool? sex,
    string? avatar) : IRequest<ErrorOr<Employee>>;