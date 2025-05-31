using ErrorOr;
using MediatR;
using SmartChain.Application.Categories.Queries.GetCategoryById;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Categories;

namespace SmartChain.Application.Categories.Queries.GetCategory;

public class GetCategoryQueryHandler : IRequestHandler<GetCategoryQueryById, ErrorOr<Category>>
{
    private readonly ICategoriesRepository _categoriesRepository;

    public GetCategoryQueryHandler(ICategoriesRepository categoriesRepository)
    {
        _categoriesRepository = categoriesRepository;
    }

    public async Task<ErrorOr<Category>> Handle(GetCategoryQueryById request, CancellationToken cancellationToken)
    {
        var category = await _categoriesRepository.GetByIdAsync(request.CategoryId, cancellationToken);
        if (category is null)
        {
            return Error.NotFound(description: "Category not found.");
        }

        return category;
    }
}