using SmartChain.Domain.Categories;

namespace SmartChain.Application.Common.Interfaces;

public interface ICategoriesRepository
{
    Task AddAsync(Category category, CancellationToken cancellationToken);
    Task<Category?> GetByIdAsync(Guid categoryId, CancellationToken cancellationToken);
    Task<Category?> GetByProductCategoryId(Guid productCategoryId, CancellationToken cancellationToken);
    Task UpdateAsync(Category category, CancellationToken cancellationToken);
    Task DeleteAsync(Category category, CancellationToken cancellationToken);
}