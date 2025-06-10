using ErrorOr;
using MediatR;
using SmartChain.Domain.Product;

namespace SmartChain.Application.Products.Commands.CreateProduct;

public record CreateProductCommand(string name, string description, string? Image, Guid categoryId) : IRequest<ErrorOr<Product>>;