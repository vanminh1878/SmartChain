using ErrorOr;
using MediatR;
using SmartChain.Domain.Customer;
using SmartChain.Application.Customers.Queries.GetCustomerByAccountId;

namespace SmartChain.Application.Customers.Queries.GetCustomerByAccountId
{
    public record GetCustomerByAccountIdQuery(Guid AccountId) : IRequest<ErrorOr<ProfileResponse>>;
}