using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Employees.Commands.CreateEmployee;
using SmartChain.Application.Employees.Commands.UpdateEmployee;
using SmartChain.Application.Employees.Commands.LockEmployee;
using SmartChain.Application.Employees.Queries.GetEmployee;
using SmartChain.Application.Employees.Queries.GetEmployeeById;
using SmartChain.Application.Users.Queries.GetUserById;
using SmartChain.Application.Stores.Queries.GetStoreById;
using SmartChain.Application.Accounts.Queries.GetAccountByUserId;
using SmartChain.Contracts.Employees;
using SmartChain.Domain.Employee;

namespace SmartChain.Api.Controllers;

[ApiController]
[Route("employees")]
public class EmployeesController : ApiController
{
    private readonly ISender _mediator;

    public EmployeesController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateEmployee(CreateEmployeeRequest request)
    {
        var command = new CreateEmployeeCommand(request.Fullname, request.Email, request.PhoneNumber, request.Birthday, request.Address,
                                                 request.Sex, request.Avatar, request.RoleId, request.Username, request.Password, request.StoreId);
        ErrorOr<Employee> result = await _mediator.Send(command);

        return result.Match(
            employee => CreatedAtAction(
                actionName: nameof(GetEmployeeById),
                routeValues: new { employeeId = employee.Id },
                value: ToDto(employee)),
            Problem);
    }

    [HttpPut("{employeeId:guid}")]
    public async Task<IActionResult> UpdateEmployee(Guid employeeId, UpdateEmployeeRequest request)
    {
        var command = new UpdateEmployeeCommand(employeeId, request.StoreId, request.fullname, request.email, request.phoneNumber,
                                                request.birthday, request.address, request.sex, request.avatar);
        ErrorOr<Employee> result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem);
    }

    [HttpPut("lock/{employeeId:Guid}")]
    public async Task<IActionResult> LockEmployee(Guid employeeId)
    {
        var command = new LockEmployeeCommand(employeeId);
        ErrorOr<Employee> result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem);
    }


    [HttpGet("{employeeId:Guid}")]
    public async Task<IActionResult> GetEmployeeById(Guid employeeId)
    {
        var query = new GetEmployeeByIdQuery(employeeId);
        ErrorOr<Employee> result = await _mediator.Send(query);
        return result.Match(
            Employee => Ok(ToDto(Employee)),
            Problem);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllEmployees()
    {
        var query = new GetEmployeeQuery();
        ErrorOr<List<Employee>> result = await _mediator.Send(query);

        return result.Match(
           Employees => Ok(Employees.Select(ToDto).ToList()),
           Problem);
    }


private EmployeeResponse ToDto(Employee employee) =>
        new(employee.Id,
            employee.UserId,
            employee.StoreId,
            employee.CreatedAt,
            employee.UpdatedAt);
    
}