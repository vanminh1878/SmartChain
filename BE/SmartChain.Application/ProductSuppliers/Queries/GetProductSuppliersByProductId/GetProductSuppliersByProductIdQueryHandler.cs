using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.ProductSupplier;

namespace SmartChain.Application.ProductSuppliers.Queries.GetProductSuppliersByProductId;

public class GetProductSuppliersByProductIdQueryHandler : IRequestHandler<GetProductSuppliersByProductIdQuery, ErrorOr<List<ProductSupplier>>>
{
    private readonly IProductSuppliersRepository _productSuppliersRepository;

    public GetProductSuppliersByProductIdQueryHandler(IProductSuppliersRepository productSuppliersRepository)
    {
        _productSuppliersRepository = productSuppliersRepository;
    }

    public async Task<ErrorOr<List<ProductSupplier>>> Handle(GetProductSuppliersByProductIdQuery request, CancellationToken cancellationToken)
    {
        var productSuppliers = await _productSuppliersRepository.GetByProductIdAsync(request.ProductId, cancellationToken);
        if (productSuppliers is null || !productSuppliers.Any())
        {
            return Error.NotFound(description: "No product suppliers found for the given product ID.");
        }

        return productSuppliers;
    }
}