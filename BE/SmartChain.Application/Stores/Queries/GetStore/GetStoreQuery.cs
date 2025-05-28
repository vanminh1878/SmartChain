using ErrorOr;
using MediatR;
using SmartChain.Domain.Store;
using SmartChain.Domain.Role;

namespace SmartChain.Application.Stores.Queries.GetStore
{
    public record GetStoreQuery() : IRequest<ErrorOr<List<Store>>>;
}