using ErrorOr;
using MediatR;
using SmartChain.Domain.Product;

namespace SmartChain.Application.Products.Commands.CreateProduct;

public record CreateProductCommand(string name, string description, decimal price, int stockQuantity, Guid categoryId) : IRequest<ErrorOr<Product>>;