using ErrorOr;
using MediatR;
using SmartChain.Domain.Order;

namespace SmartChain.Application.OrderDetails.Commands.CreateOrderDetail;

public record CreateOrderDetailCommand(Guid productId, int quantity, decimal unitPrice) : IRequest<ErrorOr<OrderDetail>>;