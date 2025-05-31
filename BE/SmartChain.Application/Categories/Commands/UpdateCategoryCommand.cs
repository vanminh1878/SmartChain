using ErrorOr;
using MediatR;
using SmartChain.Domain.Categories;

namespace SmartChain.Application.Categories.Commands.UpdateCategory;

public record UpdateCategoryCommand(
    Guid CategoryId,
    string Name,
    bool Status) : IRequest<ErrorOr<Success>>;