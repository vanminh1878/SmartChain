using ErrorOr;
using MediatR;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakeDetails.Queries;

public record GetStockIntakeDetailQuery(Guid Id) : IRequest<ErrorOr<StockIntakeDetail>>;