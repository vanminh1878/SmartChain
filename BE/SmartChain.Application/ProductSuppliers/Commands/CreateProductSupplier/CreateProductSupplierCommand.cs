using ErrorOr;
using MediatR;
using SmartChain.Domain.ProductSupplier;

namespace SmartChain.Application.ProductSuppliers.Commands.CreateProductSupplier;

public record CreateProductSupplierCommand(Guid ProductId, Guid SupplierId) : IRequest<ErrorOr<ProductSupplier>>;