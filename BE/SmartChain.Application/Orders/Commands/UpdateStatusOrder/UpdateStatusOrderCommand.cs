using ErrorOr;
using MediatR;

namespace SmartChain.Application.Orders.Commands.UpdateStatusOrder;

public record UpdateStatusOrderCommand(string newStatus, Guid OrderId) : IRequest<ErrorOr<Success>>;