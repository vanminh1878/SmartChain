using ErrorOr;
using MediatR;
using SmartChain.Domain.Account;

namespace SmartChain.Application.Accounts.Queries.GetAccountById
{
    public record GetAccountByIdQuery(Guid Id) : IRequest<ErrorOr<Account>>;
}