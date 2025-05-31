using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Supplier;

namespace SmartChain.Application.Suppliers.Queries.GetSupplierById;

public class GetSupplierByIdQueryHandler : IRequestHandler<GetSupplierByIdQuery, ErrorOr<Supplier>>
{
    private readonly ISuppliersRepository _SuppliersRepository;

    public GetSupplierByIdQueryHandler(ISuppliersRepository suppliersRepository)
    {
        _SuppliersRepository = suppliersRepository;
    }

    public async Task<ErrorOr<Supplier>> Handle(GetSupplierByIdQuery request, CancellationToken cancellationToken)
    {
        var Supplier = await _SuppliersRepository.GetByIdAsync(request.Id, cancellationToken);
        if (Supplier is null)
        {
            return Error.NotFound(description: "Supplier not found.");
        }

        return Supplier;
    }
}