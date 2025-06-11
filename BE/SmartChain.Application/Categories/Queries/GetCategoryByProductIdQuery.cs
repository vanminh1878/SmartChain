using ErrorOr;
using MediatR;
using SmartChain.Domain.Categories;

namespace SmartChain.Application.Categories.Queries.GetCategoryByProductId;

public record GetCategoryQueryByProductId(
    Guid ProductId) : IRequest<ErrorOr<Category>>;