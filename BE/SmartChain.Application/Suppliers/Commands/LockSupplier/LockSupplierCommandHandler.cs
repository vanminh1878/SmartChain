using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Supplier;

namespace SmartChain.Application.Suppliers.Commands.LockSupplier;

public class LockSupplierCommandHandler : IRequestHandler<LockSupplierCommand, ErrorOr<Success>>
{
    private readonly ISuppliersRepository _SuppliersRepository;

    public LockSupplierCommandHandler(ISuppliersRepository suppliersRepository)
    {
        _SuppliersRepository = suppliersRepository;
    }

    public async Task<ErrorOr<Success>> Handle(LockSupplierCommand request, CancellationToken cancellationToken)
    {
        var Supplier = await _SuppliersRepository.GetByIdAsync(request.SupplierId, cancellationToken);
        if (Supplier is null)
        {
            return Error.NotFound(description: "Supplier not found.");
        }

        var result = Supplier.UpdateStatus(request.NewStatus);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _SuppliersRepository.UpdateAsync(Supplier, cancellationToken);
        return Result.Success;
    }
}