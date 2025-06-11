using ErrorOr;
using MediatR;
using SmartChain.Application.Categories.Queries.GetCategoryByProductId;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Categories;

namespace SmartChain.Application.Categories.Queries;

public class GetCategoryByProductIdQueryHandler : IRequestHandler<GetCategoryQueryByProductId, ErrorOr<Category>>
{
    private readonly ICategoriesRepository _categoriesRepository;

    public GetCategoryByProductIdQueryHandler(ICategoriesRepository categoriesRepository)
    {
        _categoriesRepository = categoriesRepository;
    }

    public async Task<ErrorOr<Category>> Handle(GetCategoryQueryByProductId request, CancellationToken cancellationToken)
    {
        var category = await _categoriesRepository.GetByProductCategoryId(request.ProductId, cancellationToken);
        if (category is null)
        {
            return Error.NotFound(description: "Category not found.");
        }

        return category;
    }
}