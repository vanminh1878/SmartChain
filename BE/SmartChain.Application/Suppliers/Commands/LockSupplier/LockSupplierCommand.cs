using ErrorOr;
using MediatR;

namespace SmartChain.Application.Suppliers.Commands.LockSupplier;

public record LockSupplierCommand(Guid SupplierId, bool NewStatus) : IRequest<ErrorOr<Success>>;