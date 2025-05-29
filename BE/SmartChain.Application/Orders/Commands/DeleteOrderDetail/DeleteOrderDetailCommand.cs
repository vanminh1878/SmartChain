using ErrorOr;
using MediatR;

namespace SmartChain.Application.Orders.Commands.DeleteOrderDetail;

public record DeleteOrderDetailCommand(Guid productId, Guid OrderDetailId) : IRequest<ErrorOr<Success>>;