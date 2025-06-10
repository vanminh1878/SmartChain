// using ErrorOr;
// using MediatR;
// using SmartChain.Application.Common.Interfaces;
// using SmartChain.Domain.StockIntake;

// namespace SmartChain.Application.StockIntakeDetails.Commands.CreateStockIntakeDetail;

// public class CreateStockIntakeDetailCommandHandler : IRequestHandler<CreateStockIntakeDetailCommand, ErrorOr<StockIntakeDetail>>
// {
//     private readonly IStockIntakeDetailsRepository _StockIntakeDetailsRepository;

//     public CreateStockIntakeDetailCommandHandler(IStockIntakeDetailsRepository StockIntakeDetailsRepository)
//     {
//         _StockIntakeDetailsRepository = StockIntakeDetailsRepository;
//     }

//     public async Task<ErrorOr<StockIntakeDetail>> Handle(CreateStockIntakeDetailCommand request, CancellationToken cancellationToken)
//     {
//         try
//         {
//             var StockIntakeDetail = new StockIntakeDetail(request.stockIntakeId,request.productId, request.quantity, request.unitPrice);
//             await _StockIntakeDetailsRepository.AddAsync(StockIntakeDetail, cancellationToken);
//             return StockIntakeDetail;
//         }
//         catch (ArgumentException ex)
//         {
//             return Error.Failure(description: ex.Message);
//         }
//     }
// }