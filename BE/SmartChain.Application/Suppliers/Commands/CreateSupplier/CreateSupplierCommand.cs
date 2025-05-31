using ErrorOr;
using MediatR;
using SmartChain.Domain.Supplier;

namespace SmartChain.Application.Suppliers.Commands.CreateSupplier;

public record CreateSupplierCommand(string name, string contact_Name, string phoneNumber, string email, string address) : IRequest<ErrorOr<Supplier>>;