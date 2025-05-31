using ErrorOr;
using MediatR;

namespace SmartChain.Application.Suppliers.Commands.DeleteSupplier;

public record DeleteSupplierCommand(
    Guid SupplierId) : IRequest<ErrorOr<Success>>;