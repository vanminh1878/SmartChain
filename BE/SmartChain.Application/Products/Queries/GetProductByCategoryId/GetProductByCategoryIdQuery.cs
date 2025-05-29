using ErrorOr;
using MediatR;
using SmartChain.Domain.Product;

namespace SmartChain.Application.Products.Queries.GetProductByCategoryId
{
    public record GetProductByCategoryIdQuery(Guid categoryId) : IRequest<ErrorOr<List<Product>>>;
}