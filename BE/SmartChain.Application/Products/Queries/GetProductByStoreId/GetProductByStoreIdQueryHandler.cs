using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Product;

namespace SmartChain.Application.Products.Queries.GetProductByStoreId;

public class GetProductByStoreIdQueryHandler : IRequestHandler<GetProductByStoreIdQuery, ErrorOr<List<Product>>>
{
    private readonly IProductsRepository _ProductsRepository;

    public GetProductByStoreIdQueryHandler(IProductsRepository productsRepository)
    {
        _ProductsRepository = productsRepository;
    }

    public async Task<ErrorOr<List<Product>>> Handle(GetProductByStoreIdQuery request, CancellationToken cancellationToken)
    {
        var Product = await _ProductsRepository.ListByStoreIdAsync(request.StoreId, cancellationToken);
        if (Product is null)
        {
            return Error.NotFound(description: "Product not found.");
        }

        return Product;
    }
}