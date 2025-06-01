using ErrorOr;
using MediatR;
using SmartChain.Domain.Account;

namespace SmartChain.Application.Accounts.Queries.GetAccountByUserId
{
    public record GetAccountByUserIdQuery(Guid UserId) : IRequest<ErrorOr<Account>>;
}