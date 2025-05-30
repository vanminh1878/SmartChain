using ErrorOr;
using MediatR;
using SmartChain.Domain.Store;

namespace SmartChain.Application.Stores.Queries.GetStoreById
{
    public record GetStoreByIdQuery(Guid StoreId) : IRequest<ErrorOr<Store>>;
}