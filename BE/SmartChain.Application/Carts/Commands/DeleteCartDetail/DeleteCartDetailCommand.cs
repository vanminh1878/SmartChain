using ErrorOr;
using MediatR;

namespace SmartChain.Application.Carts.Commands.DeleteCartDetail;

public record DeleteCartDetailCommand(Guid productId, Guid CartId) : IRequest<ErrorOr<Success>>;