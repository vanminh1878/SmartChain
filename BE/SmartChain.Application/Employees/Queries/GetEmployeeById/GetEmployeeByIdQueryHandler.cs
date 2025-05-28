using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Employee;

namespace SmartChain.Application.Employees.Queries.GetEmployeeById;

public class GetEmployeeByIdQueryHandler : IRequestHandler<GetEmployeeByIdQuery, ErrorOr<Employee>>
{
    private readonly IEmployeesRepository _EmployeesRepository;

    public GetEmployeeByIdQueryHandler(IEmployeesRepository EmployeesRepository)
    {
        _EmployeesRepository = EmployeesRepository;
    }

    public async Task<ErrorOr<Employee>> Handle(GetEmployeeByIdQuery request, CancellationToken cancellationToken)
    {
        var Employee = await _EmployeesRepository.GetByIdAsync(request.EmployeeId, cancellationToken);
        if (Employee is null)
        {
            return Error.NotFound(description: "Employee not found.");
        }

        return Employee;
    }
}