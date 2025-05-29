using ErrorOr;
using MediatR;

namespace SmartChain.Application.Carts.Commands.DeleteCartDetail;

public record DeleteCartDetailCommand(Guid productId, Guid CartDetailId) : IRequest<ErrorOr<Success>>;