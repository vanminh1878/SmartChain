using ErrorOr;
using MediatR;
using SmartChain.Domain.Categories;

namespace SmartChain.Application.Categories.Queries.GetCategory;

public record GetCategoryQuery(
    Guid CategoryId,
    Guid StoreId) : IRequest<ErrorOr<Category>>;