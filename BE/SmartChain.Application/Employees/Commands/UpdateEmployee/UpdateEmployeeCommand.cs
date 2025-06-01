using ErrorOr;
using MediatR;
using SmartChain.Domain.Employee;

namespace SmartChain.Application.Employees.Commands.UpdateEmployee;

public record UpdateEmployeeCommand(
    Guid Id,
    Guid StoreId,
    string fullname,
     string email,
      string phoneNumber,
      DateTime birthday,
      string address,
      bool sex,
      string avatar) : IRequest<ErrorOr<Employee>>;