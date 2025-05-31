using ErrorOr;
using MediatR;
using SmartChain.Application.Categories.Queries.GetCategoriesQuery;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Categories;

namespace SmartChain.Application.Categories.Queries.GetCategory;

public class GetCategoriesQueryHandler : IRequestHandler<GetCategories, ErrorOr<List<Category>>>
{
    private readonly ICategoriesRepository _categoriesRepository;

    public GetCategoriesQueryHandler(ICategoriesRepository categoriesRepository)
    {
        _categoriesRepository = categoriesRepository;
    }

    public async Task<ErrorOr<List<Category>>> Handle(GetCategories request, CancellationToken cancellationToken)
    {
        var categories = await _categoriesRepository.ListAllAsync( cancellationToken);
        if (categories is null)
        {
            return Error.NotFound(description: "Category not found.");
        }

        return categories;
    }
}