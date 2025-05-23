using ErrorOr;
using MediatR;

namespace SmartChain.Application.Categories.Commands.DeleteCategory;

public record DeleteCategoryCommand(
    Guid CategoryId,
    Guid StoreId) : IRequest<ErrorOr<Success>>;