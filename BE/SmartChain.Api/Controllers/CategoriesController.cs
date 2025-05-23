using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Categories.Commands.CreateCategory;
using SmartChain.Application.Categories.Commands.DeleteCategory;
using SmartChain.Application.Categories.Commands.UpdateCategory;
using SmartChain.Application.Categories.Queries.GetCategory;
using SmartChain.Contracts.Categories;
using SmartChain.Domain.Categories;

namespace SmartChain.Api.Controllers;

[ApiController]
[Authorize]
[Route("stores/{storeId:guid}/categories")]
public class CategoriesController : ApiController
{
    private readonly ISender _mediator;

    public CategoriesController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategory(Guid storeId, CreateCategoryRequest request)
    {
        var command = new CreateCategoryCommand(storeId, request.Name);
        var result = await _mediator.Send(command);

        return result.Match(
            category => CreatedAtAction(
                actionName: nameof(GetCategory),
                routeValues: new { StoreId = storeId, CategoryId = category.Id },
                value: ToDto(category)),
            Problem);
    }

    [HttpPut("{categoryId:guid}")]
    public async Task<IActionResult> UpdateCategory(Guid storeId, Guid categoryId, UpdateCategoryRequest request)
    {
        var command = new UpdateCategoryCommand(categoryId, storeId, request.Name, request.Status);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem);
    }

    [HttpDelete("{categoryId:guid}")]
    public async Task<IActionResult> DeleteCategory(Guid storeId, Guid categoryId)
    {
        var command = new DeleteCategoryCommand(categoryId, storeId);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem);
    }

    [HttpGet("{categoryId:guid}")]
    public async Task<IActionResult> GetCategory(Guid storeId, Guid categoryId)
    {
        var query = new GetCategoryQuery(categoryId, storeId);
        var result = await _mediator.Send(query);

        return result.Match(
            category => Ok(ToDto(category)),
            Problem);
    }


    private CategoryResponse ToDto(Category category) =>
        new(category.Id, category.Name, category.StoreId, category.Status, category.CreatedAt, category.UpdatedAt);
}