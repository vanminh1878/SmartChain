using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Product;

namespace SmartChain.Application.Products.Commands.UpdateProduct;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, ErrorOr<Success>>
{
    private readonly IProductsRepository _ProductsRepository;

    public UpdateProductCommandHandler(IProductsRepository productsRepository)
    {
        _ProductsRepository = productsRepository;
    }

    public async Task<ErrorOr<Success>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var Product = await _ProductsRepository.GetByIdAsync(request.ProductId, cancellationToken);
        if (Product is null)
        {
            return Error.NotFound(description: "Product not found.");
        }

        var result = Product.Update(request.name, request.description, request.price, request.Image);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _ProductsRepository.UpdateAsync(Product, cancellationToken);
        return Result.Success;
    }
}