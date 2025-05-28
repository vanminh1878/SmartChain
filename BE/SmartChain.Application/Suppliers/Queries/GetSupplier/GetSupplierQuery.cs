using ErrorOr;
using MediatR;
using SmartChain.Domain.Supplier;
using SmartChain.Domain.Role;

namespace SmartChain.Application.Suppliers.Queries.GetSupplier
{
    public record GetSupplierQuery() : IRequest<ErrorOr<List<Supplier>>>;
}