using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Product;

namespace SmartChain.Application.Products.Commands.CreateProduct;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ErrorOr<Product>>
{
    private readonly IProductsRepository _ProductsRepository;

    public CreateProductCommandHandler(IProductsRepository productsRepository)
    {
        _ProductsRepository = productsRepository;
    }

    public async Task<ErrorOr<Product>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var Product = new Product(request.name, request.description, request.price, request.stockQuantity, request.categoryId, request.storeId);
            await _ProductsRepository.AddAsync(Product, cancellationToken);
            return Product;
        }
        catch (ArgumentException ex)
        {
            return Error.Failure(description: ex.Message);
        }
    }
}