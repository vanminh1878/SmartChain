using ErrorOr;
using MediatR;
using SmartChain.Domain.Cart;

namespace SmartChain.Application.Carts.Commands.CreateCartForCustomer;

public record CreateCartForCustomerCommand(
    Guid? CustomerId,
    Guid StoreId
) : IRequest<ErrorOr<Cart>>;