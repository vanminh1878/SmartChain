using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Employee;

namespace SmartChain.Application.Employees.Queries.GetEmployee;

public class GetEmployeeQueryHandler : IRequestHandler<GetEmployeeQuery, ErrorOr<List<Employee>>>
{
    private readonly IEmployeesRepository _EmployeesRepository;

    public GetEmployeeQueryHandler(IEmployeesRepository EmployeesRepository)
    {
        _EmployeesRepository = EmployeesRepository;
    }

    public async Task<ErrorOr<List<Employee>>> Handle(GetEmployeeQuery request, CancellationToken cancellationToken)
    {
        var Employee = await _EmployeesRepository.ListAllAsync(cancellationToken);
        if (Employee is null)
        {
            return Error.NotFound(description: "Employee not found.");
        }

        return Employee;
    }
}