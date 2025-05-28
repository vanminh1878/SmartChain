using ErrorOr;
using MediatR;
using SmartChain.Domain.Employee;

namespace SmartChain.Application.Employees.Queries.GetEmployeeById
{
    public record GetEmployeeByIdQuery(Guid EmployeeId) : IRequest<ErrorOr<Employee>>;
}