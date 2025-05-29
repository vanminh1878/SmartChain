using ErrorOr;
using MediatR;

namespace SmartChain.Application.Products.Commands.UpdateProduct;

public record UpdateProductCommand(Guid ProductId,string name, string description, decimal price, int stockQuantity, Guid categoryId) : IRequest<ErrorOr<Success>>;