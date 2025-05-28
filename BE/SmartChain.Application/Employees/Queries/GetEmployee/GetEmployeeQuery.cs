using ErrorOr;
using MediatR;
using SmartChain.Domain.Employee;
using SmartChain.Domain.Role;

namespace SmartChain.Application.Employees.Queries.GetEmployee
{
    public record GetEmployeeQuery() : IRequest<ErrorOr<List<Employee>>>;
}