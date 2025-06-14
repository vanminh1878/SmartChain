using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Cart;
using SmartChain.Domain.CartDetail;

namespace SmartChain.Application.CartDetails.Commands.CreateCartDetail;

public class CreateCartDetailCommandHandler : IRequestHandler<CreateCartDetailCommand, ErrorOr<CartDetail>>
{
    private readonly ICartDetailsRepository _CartDetailsRepository;

    public CreateCartDetailCommandHandler(ICartDetailsRepository cartDetailsRepository)
    {
        _CartDetailsRepository = cartDetailsRepository;
    }

    public async Task<ErrorOr<CartDetail>> Handle(CreateCartDetailCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var CartDetail = new CartDetail(request.CartId,request.productId, request.quantity, request.unitPrice);
            await _CartDetailsRepository.AddAsync(CartDetail, cancellationToken);
            return CartDetail;
        }
        catch (ArgumentException ex)
        {
            return Error.Failure(description: ex.Message);
        }
    }
}