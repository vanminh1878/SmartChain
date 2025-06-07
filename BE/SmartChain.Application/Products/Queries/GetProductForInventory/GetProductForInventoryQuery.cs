using ErrorOr;
using MediatR;
using SmartChain.Domain.Product;
using SmartChain.Domain.Role;

namespace SmartChain.Application.Products.Queries.GetProductForInventory
{
    public record GetProductForInventoryQuery() : IRequest<ErrorOr<List<ProductForInventoryDto>>>;
}