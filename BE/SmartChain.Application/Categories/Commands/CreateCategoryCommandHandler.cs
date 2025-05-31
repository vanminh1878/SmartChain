using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Categories;

namespace SmartChain.Application.Categories.Commands.CreateCategory;

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, ErrorOr<Category>>
{
    private readonly ICategoriesRepository _categoriesRepository;

    public CreateCategoryCommandHandler(ICategoriesRepository categoriesRepository)
    {
        _categoriesRepository = categoriesRepository;
    }

    public async Task<ErrorOr<Category>> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {

            var existingCategory = await _categoriesRepository.GetByNameAsync(request.Name, cancellationToken);
            if (existingCategory != null)
            {
                return Error.Conflict("Category with the same name already exists.");
            }
            var category = new Category(request.Name);
            await _categoriesRepository.AddAsync(category, cancellationToken);
            return category;

    }
}