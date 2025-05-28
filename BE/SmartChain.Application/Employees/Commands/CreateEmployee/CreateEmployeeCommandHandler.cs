using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Employee;

namespace SmartChain.Application.Employees.Commands.CreateEmployee;

public class CreateEmployeeCommandHandler : IRequestHandler<CreateEmployeeCommand, ErrorOr<Employee>>
{
    private readonly IEmployeesRepository _EmployeesRepository;

    public CreateEmployeeCommandHandler(IEmployeesRepository employeesRepository)
    {
        _EmployeesRepository = employeesRepository;
    }

    public async Task<ErrorOr<Employee>> Handle(CreateEmployeeCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var Employee = new Employee(request.userId, request.storeId);
            await _EmployeesRepository.AddAsync(Employee, cancellationToken);
            return Employee;
        }
        catch (ArgumentException ex)
        {
            return Error.Failure(description: ex.Message);
        }
    }
}