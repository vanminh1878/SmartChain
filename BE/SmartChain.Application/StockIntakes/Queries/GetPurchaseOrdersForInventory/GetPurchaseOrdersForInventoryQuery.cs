using ErrorOr;
using MediatR;
using SmartChain.Application.StockIntakes.Queries.GetPurchaseOrdersForInventory;
using SmartChain.Domain.Product;
using SmartChain.Domain.Role;

namespace SmartChain.Application.StockIntakes.Queries.GetPurchaseOrdersForInventory
{
    public record GetPurchaseOrdersForInventoryQuery() : IRequest<ErrorOr<List<SupplierPurchaseOrdersDto>>>;
}