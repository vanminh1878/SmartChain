using ErrorOr;
using MediatR;
using SmartChain.Domain.Store;

namespace SmartChain.Application.Stores.Commands.CreateStore;

public record CreateStoreCommand(string name, string email, string phoneNumber, string address, Guid ownerId, decimal latitude,decimal longitude, string image ) : IRequest<ErrorOr<Store>>;