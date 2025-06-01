using ErrorOr;
using MediatR;
using SmartChain.Domain.Employee;

namespace SmartChain.Application.Employees.Commands.LockEmployee;

public record LockEmployeeCommand(
    Guid EmployeeId) : IRequest<ErrorOr<Employee>>;