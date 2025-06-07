using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace SmartChain.Application.Products.Queries.GetProductForInventory;

public class GetProductForInventoryQueryHandler : IRequestHandler<GetProductForInventoryQuery, ErrorOr<List<ProductForInventoryDto>>>
{
    private readonly IProductsRepository _productsRepository;

    public GetProductForInventoryQueryHandler(
        IProductsRepository productsRepository)
    {
        _productsRepository = productsRepository;
    }

    public async Task<ErrorOr<List<ProductForInventoryDto>>> Handle(GetProductForInventoryQuery request, CancellationToken cancellationToken)
    {
        var products = await _productsRepository.GetProductsForInventoryAsync(cancellationToken);
        if (products == null || !products.Any())
        {
            return Error.NotFound(description: "Không tìm thấy sản phẩm.");
        }

        return products;
    }
}