using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Categories;

namespace SmartChain.Application.Categories.Commands.UpdateCategory;

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, ErrorOr<Success>>
{
    private readonly ICategoriesRepository _categoriesRepository;

    public UpdateCategoryCommandHandler(ICategoriesRepository categoriesRepository)
    {
        _categoriesRepository = categoriesRepository;
    }

    public async Task<ErrorOr<Success>> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoriesRepository.GetByIdAsync(request.CategoryId, cancellationToken);
        if (category is null)
        {
            return Error.NotFound(description: "Category not found.");
        }
        var existingCategory = await _categoriesRepository.GetByNameAsync(request.Name, cancellationToken);
        if (existingCategory is not null && existingCategory.Id != request.CategoryId)
        {
            return Error.Conflict("Category with the same name already exists.");
        }
        var result = category.Update(request.Name, request.Status);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _categoriesRepository.UpdateAsync(category, cancellationToken);
        return Result.Success;
    }
}