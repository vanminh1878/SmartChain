using ErrorOr;
using MediatR;
using SmartChain.Domain.Customer;

namespace SmartChain.Application.Customers.Commands.LockCustomer;

public record LockCustomerCommand(
    Guid CustomerId) : IRequest<ErrorOr<Customer>>;