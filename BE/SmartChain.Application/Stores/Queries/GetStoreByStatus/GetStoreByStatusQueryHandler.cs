using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Store;

namespace SmartChain.Application.Stores.Queries.GetStoreByStatus;

public class GetStoreByStatusQueryHandler : IRequestHandler<GetStoreByStatusQuery, ErrorOr<List<Store>>>
{
    private readonly IStoresRepository _StoresRepository;

    public GetStoreByStatusQueryHandler(IStoresRepository storesRepository)
    {
        _StoresRepository = storesRepository;
    }

    public async Task<ErrorOr<List<Store>>> Handle(GetStoreByStatusQuery request, CancellationToken cancellationToken)
    {
        var Store = await _StoresRepository.ListByStatusAsync(request.Status, cancellationToken);
        if (Store is null)
        {
            return Error.NotFound(description: "Store not found.");
        }

        return Store;
    }
}