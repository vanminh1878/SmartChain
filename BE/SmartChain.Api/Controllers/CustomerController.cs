using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Customers.Commands.CreateCustomer;
using SmartChain.Application.Customers.Commands.UpdateCustomer;
using SmartChain.Application.Customers.Commands.LockCustomer;
using SmartChain.Application.Customers.Queries.GetCustomer;
using SmartChain.Application.Customers.Queries.GetCustomerById;
using SmartChain.Application.Users.Queries.GetUserById;
using SmartChain.Application.Stores.Queries.GetStoreById;
using SmartChain.Application.Accounts.Queries.GetAccountByUserId;
using SmartChain.Contracts.Customers;
using SmartChain.Domain.Customer;

namespace SmartChain.Api.Controllers;

[ApiController]
[Route("Customers")]
public class CustomersController : ApiController
{
    private readonly ISender _mediator;

    public CustomersController(ISender mediator)
    {
        _mediator = mediator;
    }



    [HttpPut("{CustomerId:guid}")]
    public async Task<IActionResult> UpdateCustomer(Guid CustomerId, UpdateCustomerRequest request)
    {
        var command = new UpdateCustomerCommand(CustomerId, request.fullname, request.email, request.phoneNumber,
                                                request.birthday, request.address, request.sex, request.avatar);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem);
    }

    [HttpPut("lock/{CustomerId:Guid}")]
    public async Task<IActionResult> LockCustomer(Guid CustomerId)
    {
        var command = new LockCustomerCommand(CustomerId);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem);
    }


    [HttpGet("{CustomerId:Guid}")]
    public async Task<IActionResult> GetCustomerById(Guid CustomerId)
    {
        var query = new GetCustomerByIdQuery(CustomerId);
        ErrorOr<Customer> result = await _mediator.Send(query);
        return result.Match(
            Customer => Ok(Customer),
            Problem);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCustomers()
    {
        var query = new GetCustomerQuery();
        ErrorOr<List<Customer>> result = await _mediator.Send(query);

        return result.Match(
           Customers => Ok(Customers),
           Problem);
    }


private CustomerResponse ToDto(Customer customer) =>
        new(customer.Id,
            customer.CreatedAt,
            customer.UpdatedAt);
    
}