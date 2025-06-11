using ErrorOr;
using MediatR;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakes.Queries.GetStockIntakeById;

public record GetStockIntakeByIdQuery(Guid Id) : IRequest<ErrorOr<StockIntake>>;