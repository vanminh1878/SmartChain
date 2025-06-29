using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Supplier;

namespace SmartChain.Application.Suppliers.Commands.CreateSupplier;

public class CreateSupplierCommandHandler : IRequestHandler<CreateSupplierCommand, ErrorOr<Supplier>>
{
    private readonly ISuppliersRepository _SuppliersRepository;

    public CreateSupplierCommandHandler(ISuppliersRepository SuppliersRepository)
    {
        _SuppliersRepository = SuppliersRepository;
    }

    public async Task<ErrorOr<Supplier>> Handle(CreateSupplierCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var existingSupplier = await _SuppliersRepository.GetByNameAsync(request.name, cancellationToken);
            if (existingSupplier is not null)
            {
                return Error.Conflict("Supplier with the same name already exists.");
            }
            var Supplier = new Supplier(request.name, request.contact_Name, request.phoneNumber, request.email,request.address,
                request.latitude, request.longitude);
            await _SuppliersRepository.AddAsync(Supplier, cancellationToken);
            return Supplier;
        }
        catch (ArgumentException ex)
        {
            return Error.Failure(description: ex.Message);
        }
    }
}