using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.ProductSuppliers.Commands.CreateProductSupplier;
using SmartChain.Application.ProductSuppliers.Queries.GetProductSuppliersByProductId;
using SmartChain.Application.ProductSuppliers.Queries.GetProductSuppliersBySupplierId;
using SmartChain.Contracts.ProductSuppliers;
using SmartChain.Domain.ProductSupplier;

namespace SmartChain.Api.Controllers;

[ApiController]
[Route("ProductSuppliers")]
public class ProductSuppliersController : ApiController
{
    private readonly ISender _mediator;

    public ProductSuppliersController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProductSupplier(CreateProductSupplierCommand command)
    {
        ErrorOr<ProductSupplier> result = await _mediator.Send(command);

        return result.Match(
            productSupplier => Ok(ToDto(productSupplier)),
            Problem
        );
    }

    [HttpGet("supplier/{supplierId:guid}")]
    public async Task<IActionResult> GetProductSuppliersBySupplierId(Guid supplierId)
    {
        var query = new GetProductSuppliersBySupplierIdQuery(supplierId);
        ErrorOr<List<ProductSupplier>> result = await _mediator.Send(query);

        return result.Match(
            productSuppliers => Ok(productSuppliers.Select(ToDto).ToList()),
            Problem
        );
    }
     [HttpGet("product/{productId:guid}")]
    public async Task<IActionResult> GetProductSuppliersByProductId(Guid productId)
    {
        var query = new GetProductSuppliersByProductIdQuery(productId);
        ErrorOr<List<ProductSupplier>> result = await _mediator.Send(query);

        return result.Match(
            productSuppliers => Ok(productSuppliers.Select(ToDto).ToList()),
            Problem
        );
    }

    private ProductSupplierResponse ToDto(ProductSupplier productSupplier) =>
        new ProductSupplierResponse(
            productSupplier.Id,
            productSupplier.ProductId,
            productSupplier.SupplierId,
            productSupplier.CreatedAt,
            productSupplier.UpdatedAt
        );
}