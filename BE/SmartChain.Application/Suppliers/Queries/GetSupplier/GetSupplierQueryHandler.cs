using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Supplier;

namespace SmartChain.Application.Suppliers.Queries.GetSupplier;

public class GetSupplierQueryHandler : IRequestHandler<GetSupplierQuery, ErrorOr<List<Supplier>>>
{
    private readonly ISuppliersRepository _SuppliersRepository;

    public GetSupplierQueryHandler(ISuppliersRepository suppliersRepository)
    {
        _SuppliersRepository = suppliersRepository;
    }

    public async Task<ErrorOr<List<Supplier>>> Handle(GetSupplierQuery request, CancellationToken cancellationToken)
    {
        var Supplier = await _SuppliersRepository.ListAllAsync(cancellationToken);
        if (Supplier is null)
        {
            return Error.NotFound(description: "Supplier not found.");
        }

        return Supplier;
    }
}