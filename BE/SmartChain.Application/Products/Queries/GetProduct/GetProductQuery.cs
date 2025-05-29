using ErrorOr;
using MediatR;
using SmartChain.Domain.Product;
using SmartChain.Domain.Role;

namespace SmartChain.Application.Products.Queries.GetProduct
{
    public record GetProductQuery() : IRequest<ErrorOr<List<Product>>>;
}