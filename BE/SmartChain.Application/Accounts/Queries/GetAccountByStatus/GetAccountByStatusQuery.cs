using ErrorOr;
using MediatR;
using SmartChain.Domain.Account;

namespace SmartChain.Application.Accounts.Queries.GetAccountByStatus
{
    public record GetAccountByStatusQuery(bool Status) : IRequest<ErrorOr<List<Account>>>;
}