using ErrorOr;
using MediatR;
using SmartChain.Domain.Supplier;

namespace SmartChain.Application.Suppliers.Queries.GetSupplierById
{
    public record GetSupplierByIdQuery(Guid Id) : IRequest<ErrorOr<Supplier>>;
}