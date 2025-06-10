// using ErrorOr;
// using MediatR;
// using SmartChain.Application.Common.Interfaces;
// using SmartChain.Domain.StockIntake;

// namespace SmartChain.Application.StockIntakes.Commands.CreateStockIntake;

// public class CreateStockIntakeCommandHandler : IRequestHandler<CreateStockIntakeCommand, ErrorOr<StockIntake>>
// {
//     private readonly IStockIntakesRepository _StockIntakesRepository;

//     public CreateStockIntakeCommandHandler(IStockIntakesRepository StockIntakesRepository)
//     {
//         _StockIntakesRepository = StockIntakesRepository;
//     }

//     public async Task<ErrorOr<StockIntake>> Handle(CreateStockIntakeCommand request, CancellationToken cancellationToken)
//     {
//         try
//         {
//             var StockIntake = new StockIntake(request.supplierId, request.storeId, request.intakeDate,request.createdBy);
//             await _StockIntakesRepository.AddAsync(StockIntake, cancellationToken);
//             return StockIntake;
//         }
//         catch (ArgumentException ex)
//         {
//             return Error.Failure(description: ex.Message);
//         }
//     }
// }