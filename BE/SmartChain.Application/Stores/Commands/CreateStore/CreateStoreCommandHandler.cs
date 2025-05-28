using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Store;

namespace SmartChain.Application.Stores.Commands.CreateStore;

public class CreateStoreCommandHandler : IRequestHandler<CreateStoreCommand, ErrorOr<Store>>
{
    private readonly IStoresRepository _StoresRepository;

    public CreateStoreCommandHandler(IStoresRepository storesRepository)
    {
        _StoresRepository = storesRepository;
    }

    public async Task<ErrorOr<Store>> Handle(CreateStoreCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var Store = new Store(request.name, request.address, request.phoneNumber, request.email, request.ownerId);
            await _StoresRepository.AddAsync(Store, cancellationToken);
            return Store;
        }
        catch (ArgumentException ex)
        {
            return Error.Failure(description: ex.Message);
        }
    }
}