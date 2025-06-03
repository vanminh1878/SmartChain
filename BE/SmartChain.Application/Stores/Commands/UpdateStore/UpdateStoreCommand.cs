using ErrorOr;
using MediatR;

namespace SmartChain.Application.Stores.Commands.UpdateStore;

public record UpdateStoreCommand(Guid StoreId, string? name, string? address, string? phoneNumber, string? email,
                                    Guid ownerId, decimal? latitude, decimal? longitude, string? image) : IRequest<ErrorOr<Success>>;