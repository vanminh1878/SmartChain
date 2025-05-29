using ErrorOr;
using MediatR;

namespace SmartChain.Application.Carts.Commands.ConvertSelectedToOrder;

public record ConvertSelectedToOrderCommand(List<Guid> ProductIds, Guid CartId) : IRequest<ErrorOr<Success>>;