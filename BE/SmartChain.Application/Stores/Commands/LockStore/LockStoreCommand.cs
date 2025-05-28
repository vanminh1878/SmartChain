using ErrorOr;
using MediatR;

namespace SmartChain.Application.Stores.Commands.LockStore;

public record LockStoreCommand(Guid StoreId, bool NewStatus) : IRequest<ErrorOr<Success>>;