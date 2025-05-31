using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;

namespace SmartChain.Application.Categories.Commands.DeleteCategory;

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, ErrorOr<Success>>
{
    private readonly ICategoriesRepository _categoriesRepository;
    private readonly IProductsRepository _productsRepository;

    public DeleteCategoryCommandHandler(ICategoriesRepository categoriesRepository, IProductsRepository productsRepository)
    {
        _categoriesRepository = categoriesRepository;
        _productsRepository = productsRepository;
    }

    public async Task<ErrorOr<Success>> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoriesRepository.GetByIdAsync(request.CategoryId, cancellationToken);
        if (category is null)
        {
            return Error.NotFound(description: "Category not found.");
        }
        var products = await _productsRepository.GetCategoryByProductIdAsync(request.CategoryId, cancellationToken);
        if (products is not null)
        {
            return Error.Failure("Cannot delete category with associated products.");
        }

        await _categoriesRepository.DeleteAsync(category, cancellationToken);
        return Result.Success;
    }
}