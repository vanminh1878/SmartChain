using ErrorOr;
using MediatR;
using SmartChain.Domain.Store;

namespace SmartChain.Application.Stores.Queries.GetStoreByStatus
{
    public record GetStoreByStatusQuery(bool Status) : IRequest<ErrorOr<List<Store>>>;
}