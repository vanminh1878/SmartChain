using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Cart;

namespace SmartChain.Application.Carts.Commands.CreateCart;

public class CreateCartCommandHandler : IRequestHandler<CreateCartCommand, ErrorOr<Cart>>
{
    private readonly ICartsRepository _CartsRepository;

    public CreateCartCommandHandler(ICartsRepository cartsRepository)
    {
        _CartsRepository = cartsRepository;
    }

    public async Task<ErrorOr<Cart>> Handle(CreateCartCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var Cart = new Cart(request.customerId, request.storeId);
            await _CartsRepository.AddAsync(Cart, cancellationToken);
            return Cart;
        }
        catch (ArgumentException ex)
        {
            return Error.Failure(description: ex.Message);
        }
    }
}