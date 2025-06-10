// using ErrorOr;
// using MediatR;
// using SmartChain.Application.Common.Interfaces;

// namespace SmartChain.Application.Suppliers.Commands.DeleteSupplier;

// public class DeleteSupplierCommandHandler : IRequestHandler<DeleteSupplierCommand, ErrorOr<Success>>
// {
//     private readonly ISuppliersRepository _suppliersRepository;
//     private readonly IStockIntakesRepository _stockIntakeRepository;

//     public DeleteSupplierCommandHandler(ISuppliersRepository suppliersRepository, IStockIntakesRepository stockIntakeRepository)
//     {
//         _suppliersRepository = suppliersRepository;
//         _stockIntakeRepository = stockIntakeRepository;
//     }

//     public async Task<ErrorOr<Success>> Handle(DeleteSupplierCommand request, CancellationToken cancellationToken)
//     {
//         var Supplier = await _suppliersRepository.GetByIdAsync(request.SupplierId, cancellationToken);
//         if (Supplier is null)
//         {
//             return Error.NotFound(description: "Supplier not found.");
//         }
//         var stockIntakes = await _stockIntakeRepository.ListBySupplierIdAsync(request.SupplierId, cancellationToken);
//         if (stockIntakes.Any())
//         {
//             return Error.Failure("Cannot delete Supplier with associated Stock Intake.");
//         }

//         await _suppliersRepository.RemoveAsync(Supplier, cancellationToken);
//         return Result.Success;
//     }
// }