using ErrorOr;
using MediatR;
using SmartChain.Application.StockIntakes.Queries.GetStockIntakesForInventory;
using SmartChain.Domain.Product;
using SmartChain.Domain.Role;

namespace SmartChain.Application.StockIntakes.Queries.GetStockIntakesForInventory
{
    public record GetStockIntakesForInventoryQuery() : IRequest<ErrorOr<List<StockIntakesForInventoryDto>>>;
}