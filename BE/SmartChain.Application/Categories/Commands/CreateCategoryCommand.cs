using ErrorOr;
using MediatR;
using SmartChain.Domain.Categories;

namespace SmartChain.Application.Categories.Commands.CreateCategory;

public record CreateCategoryCommand(
    Guid StoreId,
    string Name) : IRequest<ErrorOr<Category>>;