using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.ProductSupplier;

namespace SmartChain.Application.ProductSuppliers.Queries.GetProductSuppliersBySupplierId;

public class GetProductSuppliersBySupplierIdQueryHandler : IRequestHandler<GetProductSuppliersBySupplierIdQuery, ErrorOr<List<ProductSupplier>>>
{
    private readonly IProductSuppliersRepository _productSuppliersRepository;

    public GetProductSuppliersBySupplierIdQueryHandler(IProductSuppliersRepository productSuppliersRepository)
    {
        _productSuppliersRepository = productSuppliersRepository;
    }

    public async Task<ErrorOr<List<ProductSupplier>>> Handle(GetProductSuppliersBySupplierIdQuery request, CancellationToken cancellationToken)
    {
        var productSuppliers = await _productSuppliersRepository.GetBySupplierIdAsync(request.SupplierId, cancellationToken);
        if (productSuppliers is null || !productSuppliers.Any())
        {
            return Error.NotFound(description: "No product suppliers found for the given supplier ID.");
        }

        return productSuppliers;
    }
}