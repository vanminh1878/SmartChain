using ErrorOr;
using MediatR;

namespace SmartChain.Application.Categories.Commands.DeleteCategory;

public record DeleteCategoryCommand(
    Guid CategoryId) : IRequest<ErrorOr<Success>>;