using ErrorOr;
using MediatR;
using SmartChain.Domain.ProductSupplier;

namespace SmartChain.Application.ProductSuppliers.Queries.GetProductSuppliersBySupplierId;

public record GetProductSuppliersBySupplierIdQuery(Guid SupplierId) : IRequest<ErrorOr<List<ProductSupplier>>>;