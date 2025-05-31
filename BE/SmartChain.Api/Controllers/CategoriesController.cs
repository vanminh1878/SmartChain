using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Categories.Commands.CreateCategory;
using SmartChain.Application.Categories.Commands.DeleteCategory;
using SmartChain.Application.Categories.Commands.UpdateCategory;
using SmartChain.Application.Categories.Queries.GetCategoriesQuery;
using SmartChain.Application.Categories.Queries.GetCategoryById;
using SmartChain.Application.Products.Queries.GetProductByCategoryId;
using SmartChain.Contracts.Categories;
using SmartChain.Domain.Categories;

namespace SmartChain.Api.Controllers;

[ApiController]
[Route("/categories")]
public class CategoriesController : ApiController
{
    private readonly ISender _mediator;

    public CategoriesController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategory( CreateCategoryRequest request)
    {
        var command = new CreateCategoryCommand( request.Name);
        var result = await _mediator.Send(command);

        return result.Match(
            category => CreatedAtAction(
                actionName: nameof(GetCategory),
                routeValues: new {  CategoryId = category.Id },
                value: ToDto(category)),
            Problem);
    }

    [HttpPut("{categoryId:guid}")]
    public async Task<IActionResult> UpdateCategory( Guid categoryId, UpdateCategoryRequest request)
    {
        var command = new UpdateCategoryCommand(categoryId, request.Name, request.Status);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem);
    }

    [HttpDelete("{categoryId:guid}")]
    public async Task<IActionResult> DeleteCategory(Guid categoryId)
    {
        var command = new DeleteCategoryCommand(categoryId);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem);
    }

    [HttpGet("{categoryId:guid}")]
    public async Task<IActionResult> GetCategory( Guid categoryId)
    {
        var query = new GetCategoryQueryById(categoryId);
        var result = await _mediator.Send(query);

        return result.Match(
            category => Ok(ToDto(category)),
            Problem);
    }
     [HttpGet("")]
    public async Task<IActionResult> GetCategories()
    {
        var query = new GetCategories();
        var result = await _mediator.Send(query);

        return result.Match(
            Categories => Ok(Categories.Select(ToDto).ToList()),
            Problem);
    }


    private CategoryResponse ToDto(Category category) =>
        new(category.Id, category.Name,  category.Status, category.CreatedAt, category.UpdatedAt);
}