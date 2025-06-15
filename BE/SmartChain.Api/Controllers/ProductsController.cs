using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Products.Commands.UpdateProduct;
using SmartChain.Application.Products.Queries.GetProductByCategoryId;
using SmartChain.Application.Products.Queries.GetProductById;
using SmartChain.Application.Products.Queries.GetProductByName;
using SmartChain.Contracts.Products;
using SmartChain.Domain.Product;

namespace SmartChain.Api.Controllers;

[ApiController]
[Route("Products")]
public class ProductsController : ApiController
{
    private readonly ISender _mediator;

    public ProductsController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] string? search)
    {
        var query = new GetProductsByNameQuery(search);
        ErrorOr<List<Product>> result = await _mediator.Send(query);

        return result.Match(
            products => Ok(products),
            Problem
        );
    }
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProductById(Guid id)
    {
        var query = new GetProductByIdQuery(id);
        var result = await _mediator.Send(query);

        return result.Match(
            product => Ok(product),
            Problem);
    }

    [HttpGet("category/{categoryId:guid}")]
    public async Task<IActionResult> GetProductByCategoryId(Guid categoryId)
    {
        var query = new GetProductByCategoryIdQuery(categoryId);
        var result = await _mediator.Send(query);

        return result.Match(
            product => Ok(product),
            Problem);
    }
     [HttpPut("{ProductId:guid}")]
    public async Task<IActionResult> UpdateStore(Guid ProductId, UpdateProductRequest request)
    {

        var command = new UpdateProductCommand(ProductId, request.name, request.description, request.price.Value, request.Image);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem);
    }

    private ProductResponse ToDto(Product product) =>
        new ProductResponse(
            product.Id,
            product.Name,
            product.Price,
            product.Image
        );
}