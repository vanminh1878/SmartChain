using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.ProductSupplier;

namespace SmartChain.Application.ProductSuppliers.Commands.CreateProductSupplier;

public class CreateProductSupplierCommandHandler : IRequestHandler<CreateProductSupplierCommand, ErrorOr<ProductSupplier>>
{
    private readonly IProductSuppliersRepository _productSuppliersRepository;

    public CreateProductSupplierCommandHandler(IProductSuppliersRepository productSuppliersRepository)
    {
        _productSuppliersRepository = productSuppliersRepository;
    }

    public async Task<ErrorOr<ProductSupplier>> Handle(CreateProductSupplierCommand request, CancellationToken cancellationToken)
    {
        var productSupplier = new ProductSupplier(request.ProductId, request.SupplierId);

        await _productSuppliersRepository.AddAsync(productSupplier, cancellationToken);

        return productSupplier;
    }
}