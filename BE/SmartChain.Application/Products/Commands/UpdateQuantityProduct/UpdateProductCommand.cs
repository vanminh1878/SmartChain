using ErrorOr;
using MediatR;

namespace SmartChain.Application.Products.Commands.UpdateProduct;

public record UpdateQuantityProductCommand(Guid ProductId, int stockQuantity) : IRequest<ErrorOr<Success>>;