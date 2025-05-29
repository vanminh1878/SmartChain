using ErrorOr;
using MediatR;
using SmartChain.Domain.Customer;
using SmartChain.Domain.Role;

namespace SmartChain.Application.Customers.Queries.GetCustomer
{
    public record GetCustomerQuery() : IRequest<ErrorOr<List<Customer>>>;
}