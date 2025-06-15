using ErrorOr;
using MediatR;
using SmartChain.Domain.ProductSupplier;

namespace SmartChain.Application.ProductSuppliers.Queries.GetProductSuppliersByProductId;

public record GetProductSuppliersByProductIdQuery(Guid ProductId) : IRequest<ErrorOr<List<ProductSupplier>>>;