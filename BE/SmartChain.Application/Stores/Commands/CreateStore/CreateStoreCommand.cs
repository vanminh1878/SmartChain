using ErrorOr;
using MediatR;
using SmartChain.Domain.Store;

namespace SmartChain.Application.Stores.Commands.CreateStore;

public record CreateStoreCommand(string name, string address, string phoneNumber, string email, Guid ownerId) : IRequest<ErrorOr<Store>>;