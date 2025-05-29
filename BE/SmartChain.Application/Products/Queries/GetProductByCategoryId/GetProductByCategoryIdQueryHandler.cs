using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Product;

namespace SmartChain.Application.Products.Queries.GetProductByCategoryId;

public class GetProductByCategoryIdQueryHandler : IRequestHandler<GetProductByCategoryIdQuery, ErrorOr<List<Product>>>
{
    private readonly IProductsRepository _ProductsRepository;

    public GetProductByCategoryIdQueryHandler(IProductsRepository productsRepository)
    {
        _ProductsRepository = productsRepository;
    }

    public async Task<ErrorOr<List<Product>>> Handle(GetProductByCategoryIdQuery request, CancellationToken cancellationToken)
    {
        var Product = await _ProductsRepository.ListByCategoryIdAsync(request.categoryId, cancellationToken);
        if (Product is null)
        {
            return Error.NotFound(description: "Product not found.");
        }

        return Product;
    }
}