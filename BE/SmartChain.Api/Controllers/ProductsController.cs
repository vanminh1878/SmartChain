using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Mvc;
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
            products => Ok(new GetProductsResponse(products.Select(ToDto).ToList())),
            Problem
        );
    }

    private ProductResponse ToDto(Product product) =>
        new ProductResponse(
            product.Id,
            product.Name,
            product.Price,
            product.Image
        );
}