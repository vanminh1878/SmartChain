using ErrorOr;
using MediatR;
using SmartChain.Domain.Cart;

namespace SmartChain.Application.CartDetails.Commands.CreateCartDetail;

public record CreateCartDetailCommand(Guid productId, int quantity, decimal unitPrice) : IRequest<ErrorOr<CartDetail>>;