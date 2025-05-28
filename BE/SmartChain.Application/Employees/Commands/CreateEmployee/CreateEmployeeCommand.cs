using ErrorOr;
using MediatR;
using SmartChain.Domain.Employee;

namespace SmartChain.Application.Employees.Commands.CreateEmployee;

public record CreateEmployeeCommand(Guid userId, Guid storeId) : IRequest<ErrorOr<Employee>>;