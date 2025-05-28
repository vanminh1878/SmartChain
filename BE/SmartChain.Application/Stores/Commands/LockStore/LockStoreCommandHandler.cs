using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Store;

namespace SmartChain.Application.Stores.Commands.LockStore;

public class LockStoreCommandHandler : IRequestHandler<LockStoreCommand, ErrorOr<Success>>
{
    private readonly IStoresRepository _StoresRepository;

    public LockStoreCommandHandler(IStoresRepository storesRepository)
    {
        _StoresRepository = storesRepository;
    }

    public async Task<ErrorOr<Success>> Handle(LockStoreCommand request, CancellationToken cancellationToken)
    {
        var Store = await _StoresRepository.GetByIdAsync(request.StoreId, cancellationToken);
        if (Store is null)
        {
            return Error.NotFound(description: "Store not found.");
        }

        var result = Store.UpdateStatus(request.NewStatus);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _StoresRepository.UpdateAsync(Store, cancellationToken);
        return Result.Success;
    }
}