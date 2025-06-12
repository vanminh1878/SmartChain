using ErrorOr;
using MediatR;

namespace SmartChain.Application.Customers.Commands.UpdateCustomer;

public record UpdateCustomerCommand(Guid CustomerId, string fullname, string email, string phoneNumber, DateTime? birthday, string address, bool? sex, string avatar) : IRequest<ErrorOr<Success>>;