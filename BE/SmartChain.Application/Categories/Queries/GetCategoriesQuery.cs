using ErrorOr;
using MediatR;
using SmartChain.Domain.Categories;

namespace SmartChain.Application.Categories.Queries.GetCategoriesQuery;

public record GetCategories() : IRequest<ErrorOr<List<Category>>>;