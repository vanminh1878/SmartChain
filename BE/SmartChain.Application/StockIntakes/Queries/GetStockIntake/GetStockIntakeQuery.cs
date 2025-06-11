using ErrorOr;
using MediatR;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakes.Queries.GetStockIntake;

public record GetStockIntakeQuery() : IRequest<ErrorOr<List<StockIntake>>>;