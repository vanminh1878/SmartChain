using ErrorOr;
using MediatR;
using SmartChain.Domain.Supplier;

namespace SmartChain.Application.Suppliers.Queries.GetSupplierByStatus
{
    public record GetSupplierByStatusQuery(bool Status) : IRequest<ErrorOr<List<Supplier>>>;
}