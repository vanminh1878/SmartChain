using ErrorOr;
using MediatR;

namespace SmartChain.Application.Suppliers.Commands.UpdateSupplier;

public record UpdateSupplierCommand(Guid SupplierId, string newName, string newContactName, string newPhoneNumber, string newEmail, string newAddress) : IRequest<ErrorOr<Success>>;