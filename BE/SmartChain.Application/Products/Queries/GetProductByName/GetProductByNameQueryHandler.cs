using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Product;
using System.Threading;
using System.Threading.Tasks;

namespace SmartChain.Application.Products.Queries.GetProductByName;

public class GetProductsQueryHandler : IRequestHandler<GetProductsByNameQuery, ErrorOr<List<Product>>>
{
    private readonly IProductsRepository _productsRepository;

    public GetProductsQueryHandler(IProductsRepository productsRepository)
    {
        _productsRepository = productsRepository;
    }

    public async Task<ErrorOr<List<Product>>> Handle(GetProductsByNameQuery request, CancellationToken cancellationToken)
    {
        var products = await _productsRepository.GetProductsByName(request.Search, cancellationToken);
        return products;
    }
}