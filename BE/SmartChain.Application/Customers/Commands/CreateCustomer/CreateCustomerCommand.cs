using ErrorOr;
using MediatR;
using SmartChain.Domain.Customer;

namespace SmartChain.Application.Customers.Commands.CreateCustomer;

public record CreateCustomerCommand(string fullname, string email, string phoneNumber, string address, Guid accountId) : IRequest<ErrorOr<Customer>>;