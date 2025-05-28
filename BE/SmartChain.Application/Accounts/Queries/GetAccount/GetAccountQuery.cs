using ErrorOr;
using MediatR;
using SmartChain.Domain.Account;
using SmartChain.Domain.Role;

namespace SmartChain.Application.Accounts.Queries.GetAccount
{
    public record GetAccountQuery() : IRequest<ErrorOr<List<Account>>>;
}