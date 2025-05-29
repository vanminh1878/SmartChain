using ErrorOr;
using MediatR;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakes.Queries.GetStockIntakeBySupplierId
{
    public record GetStockIntakeBySupplierIdQuery(Guid supplierId) : IRequest<ErrorOr<List<StockIntake>>>;
}