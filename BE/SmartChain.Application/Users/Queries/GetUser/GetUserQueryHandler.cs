using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.User;

namespace SmartChain.Application.Users.Queries.GetUser;

public class GetUserQueryHandler : IRequestHandler<GetUserQuery, ErrorOr<List<User>>>
{
    private readonly IUsersRepository _UsersRepository;

    public GetUserQueryHandler(IUsersRepository usersRepository)
    {
        _UsersRepository = usersRepository;
    }

    public async Task<ErrorOr<List<User>>> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        var User = await _UsersRepository.ListAllAsync(cancellationToken);
        if (User is null)
        {
            return Error.NotFound(description: "User not found.");
        }

        return User;
    }
}