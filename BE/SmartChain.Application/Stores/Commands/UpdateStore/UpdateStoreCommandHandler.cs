using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Store;

namespace SmartChain.Application.Stores.Commands.UpdateStore;

public class UpdateStoreCommandHandler : IRequestHandler<UpdateStoreCommand, ErrorOr<Success>>
{
    private readonly IStoresRepository _StoresRepository;

    public UpdateStoreCommandHandler(IStoresRepository storesRepository)
    {
        _StoresRepository = storesRepository;
    }

    public async Task<ErrorOr<Success>> Handle(UpdateStoreCommand request, CancellationToken cancellationToken)
    {
        var Store = await _StoresRepository.GetByIdAsync(request.StoreId, cancellationToken);
        if (Store is null)
        {
            return Error.NotFound(description: "Store not found.");
        }
        var existingStore = await _StoresRepository.GetByNameAsync(request.name, cancellationToken);
        if (existingStore is not null && existingStore.Id != request.StoreId)
        {
            return Error.Conflict("Store with the same name already exists.");
        }
        var result = Store.Update(request.name, request.address, request.phoneNumber, request.email,
             request.latitude, request.longitude, request.image);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _StoresRepository.UpdateAsync(Store, cancellationToken);
        return Result.Success;
    }
}