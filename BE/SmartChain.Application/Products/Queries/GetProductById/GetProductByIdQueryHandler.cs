using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Product;

namespace SmartChain.Application.Products.Queries.GetProductById;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ErrorOr<Product>>
{
    private readonly IProductsRepository _ProductsRepository;

    public GetProductByIdQueryHandler(IProductsRepository productsRepository)
    {
        _ProductsRepository = productsRepository;
    }

    public async Task<ErrorOr<Product>> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var Product = await _ProductsRepository.GetByIdAsync(request.Id, cancellationToken);
        if (Product is null)
        {
            return Error.NotFound(description: "Product not found.");
        }

        return Product;
    }
}