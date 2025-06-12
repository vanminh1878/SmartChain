using ErrorOr;
using MediatR;
using SmartChain.Domain.Product;

namespace SmartChain.Application.Products.Queries.GetProductByName;

public record GetProductsByNameQuery(string? Search) : IRequest<ErrorOr<List<Product>>>;