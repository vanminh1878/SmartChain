using ErrorOr;
using MediatR;
using SmartChain.Domain.Product;

namespace SmartChain.Application.Products.Queries.GetProductByStoreId
{
    public record GetProductByStoreIdQuery(Guid StoreId) : IRequest<ErrorOr<List<Product>>>;
}