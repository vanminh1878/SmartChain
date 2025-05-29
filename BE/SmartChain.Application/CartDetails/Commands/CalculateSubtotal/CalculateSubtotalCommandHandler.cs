using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.CartDetails.Commands.CalculateSubtotal;
using SmartChain.Domain.Cart;

namespace SmartChain.Application.Carts.Commands.CalculateSubtotal;

public class CalculateSubtotalCommandHandler : IRequestHandler<CalculateSubtotalCommand, ErrorOr<decimal>>
{
    private readonly ICartDetailsRepository _CartDetailRepository;

    public CalculateSubtotalCommandHandler(ICartDetailsRepository cartDetailRepository)
    {
        _CartDetailRepository = cartDetailRepository;
    }

    public async Task<ErrorOr<decimal>> Handle(CalculateSubtotalCommand request, CancellationToken cancellationToken)
    {
        var cartDetail = await _CartDetailRepository.GetByIdAsync(request.CartDetailId, cancellationToken);
        if (cartDetail is null)
        {
            return Error.NotFound(description: "Cart Detail not found.");
        }

        var result = cartDetail.CalculateSubtotal();
        return result;
    }
}