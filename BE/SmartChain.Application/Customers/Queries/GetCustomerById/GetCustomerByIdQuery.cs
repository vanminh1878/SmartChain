using ErrorOr;
using MediatR;
using SmartChain.Domain.Customer;

namespace SmartChain.Application.Customers.Queries.GetCustomerById
{
    public record GetCustomerByIdQuery(Guid CustomerId) : IRequest<ErrorOr<Customer>>;
}