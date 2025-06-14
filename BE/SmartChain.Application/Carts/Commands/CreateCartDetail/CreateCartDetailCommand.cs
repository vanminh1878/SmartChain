using ErrorOr;
using MediatR;
using SmartChain.Domain.Cart;
using SmartChain.Domain.CartDetail;

namespace SmartChain.Application.CartDetails.Commands.CreateCartDetail;

public record CreateCartDetailCommand(Guid CartId,Guid productId, int quantity, decimal unitPrice) : IRequest<ErrorOr<CartDetail>>;