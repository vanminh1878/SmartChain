using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Cart;
using SmartChain.Domain.Product;

namespace SmartChain.Application.Carts.Commands.CreateCartForCustomer;

public class CreateCartForCustomerCommandHandler : IRequestHandler<CreateCartForCustomerCommand, ErrorOr<Cart>>
{
    private readonly ICartsRepository _cartsRepository;

    public CreateCartForCustomerCommandHandler(
        ICartsRepository cartsRepository)
    {
        _cartsRepository = cartsRepository;
    }

    public async Task<ErrorOr<Cart>> Handle(CreateCartForCustomerCommand request, CancellationToken cancellationToken)
    {
        var cart = new Cart(request.CustomerId, request.StoreId);
        await _cartsRepository.AddAsync(cart, cancellationToken);
        return cart;
    }
}