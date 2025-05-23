using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;

namespace SmartChain.Application.Categories.Commands.DeleteCategory;

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, ErrorOr<Success>>
{
    private readonly ICategoriesRepository _categoriesRepository;

    public DeleteCategoryCommandHandler(ICategoriesRepository categoriesRepository)
    {
        _categoriesRepository = categoriesRepository;
    }

    public async Task<ErrorOr<Success>> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoriesRepository.GetByIdAsync(request.CategoryId, cancellationToken);
        if (category is null)
        {
            return Error.NotFound(description: "Category not found.");
        }

        await _categoriesRepository.DeleteAsync(category, cancellationToken);
        return Result.Success;
    }
}