using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Supplier;

namespace SmartChain.Application.Suppliers.Queries.GetSupplierByStatus;

public class GetSupplierByStatusQueryHandler : IRequestHandler<GetSupplierByStatusQuery, ErrorOr<List<Supplier>>>
{
    private readonly ISuppliersRepository _SuppliersRepository;

    public GetSupplierByStatusQueryHandler(ISuppliersRepository suppliersRepository)
    {
        _SuppliersRepository = suppliersRepository;
    }

    public async Task<ErrorOr<List<Supplier>>> Handle(GetSupplierByStatusQuery request, CancellationToken cancellationToken)
    {
        var Supplier = await _SuppliersRepository.ListByStatusAsync(request.Status, cancellationToken);
        if (Supplier is null)
        {
            return Error.NotFound(description: "Supplier not found.");
        }

        return Supplier;
    }
}