using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Product;

namespace SmartChain.Application.Products.Queries.GetProduct;

public class GetProductQueryHandler : IRequestHandler<GetProductQuery, ErrorOr<List<Product>>>
{
    private readonly IProductsRepository _ProductsRepository;

    public GetProductQueryHandler(IProductsRepository productsRepository)
    {
        _ProductsRepository = productsRepository;
    }

    public async Task<ErrorOr<List<Product>>> Handle(GetProductQuery request, CancellationToken cancellationToken)
    {
        var Product = await _ProductsRepository.ListAllAsync(cancellationToken);
        if (Product is null)
        {
            return Error.NotFound(description: "Product not found.");
        }

        return Product;
    }
}