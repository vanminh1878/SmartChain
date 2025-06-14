using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Store;

namespace SmartChain.Application.Stores.Queries.GetStore;

public class GetStoreQueryHandler : IRequestHandler<GetStoreQuery, ErrorOr<List<Store>>>
{
    private readonly IStoresRepository _StoresRepository;

    public GetStoreQueryHandler(IStoresRepository storesRepository)
    {
        _StoresRepository = storesRepository;
    }

    public async Task<ErrorOr<List<Store>>> Handle(GetStoreQuery request, CancellationToken cancellationToken)
    {
        var Store = await _StoresRepository.ListAllAsync(cancellationToken);
        if (Store is null)
        {
            return Error.NotFound(description: "Store not found.");
        }
        
        return Store;
    }
}