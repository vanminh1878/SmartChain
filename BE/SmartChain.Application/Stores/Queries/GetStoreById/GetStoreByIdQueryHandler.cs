using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Store;

namespace SmartChain.Application.Stores.Queries.GetStoreById;

public class GetStoreByIdQueryHandler : IRequestHandler<GetStoreByIdQuery, ErrorOr<Store>>
{
    private readonly IStoresRepository _StoresRepository;

    public GetStoreByIdQueryHandler(IStoresRepository StoresRepository)
    {
        _StoresRepository = StoresRepository;
    }

    public async Task<ErrorOr<Store>> Handle(GetStoreByIdQuery request, CancellationToken cancellationToken)
    {
        var Store = await _StoresRepository.GetByIdAsync(request.StoreId, cancellationToken);
        if (Store is null)
        {
            return Error.NotFound(description: "Store not found.");
        }

        return Store;
    }
}