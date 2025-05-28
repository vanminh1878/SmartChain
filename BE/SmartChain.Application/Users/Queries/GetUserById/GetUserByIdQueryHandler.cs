using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.User;

namespace SmartChain.Application.Users.Queries.GetUserById;

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, ErrorOr<User>>
{
    private readonly IUsersRepository _UsersRepository;

    public GetUserByIdQueryHandler(IUsersRepository usersRepository)
    {
        _UsersRepository = usersRepository;
    }

    public async Task<ErrorOr<User>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var User = await _UsersRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (User is null)
        {
            return Error.NotFound(description: "User not found.");
        }

        return User;
    }
}