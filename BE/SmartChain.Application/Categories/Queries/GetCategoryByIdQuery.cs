using ErrorOr;
using MediatR;
using SmartChain.Domain.Categories;

namespace SmartChain.Application.Categories.Queries.GetCategoryById;

public record GetCategoryQueryById(
    Guid CategoryId) : IRequest<ErrorOr<Category>>;