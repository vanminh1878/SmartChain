using ErrorOr;
using MediatR;

namespace SmartChain.Application.Orders.Commands.UpdateOrder;

public record UpdateOrderCommand(Guid productId, int newQuantity, Guid OrderId) : IRequest<ErrorOr<Success>>;