using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Supplier;

namespace SmartChain.Application.Suppliers.Commands.UpdateSupplier;

public class UpdateSupplierCommandHandler : IRequestHandler<UpdateSupplierCommand, ErrorOr<Success>>
{
    private readonly ISuppliersRepository _SuppliersRepository;

    public UpdateSupplierCommandHandler(ISuppliersRepository SuppliersRepository)
    {
        _SuppliersRepository = SuppliersRepository;
    }

    public async Task<ErrorOr<Success>> Handle(UpdateSupplierCommand request, CancellationToken cancellationToken)
    {
        var Supplier = await _SuppliersRepository.GetByIdAsync(request.SupplierId, cancellationToken);
        if (Supplier is null)
        {
            return Error.NotFound(description: "Supplier not found.");
        }
        var existingSupplier = await _SuppliersRepository.GetByNameAsync(request.newName, cancellationToken);
        if (existingSupplier is not null && existingSupplier.Id != request.SupplierId)
        {
            return Error.Conflict("Supplier with the same name already exists.");
        }
        var result = Supplier.Update(request.newName, request.newContactName, request.newPhoneNumber, request.newEmail, request.newAddress
            , request.newLatitude, request.newLongitude);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _SuppliersRepository.UpdateAsync(Supplier, cancellationToken);
        return Result.Success;
    }
}