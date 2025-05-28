using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.User;

namespace SmartChain.Application.Users.Commands.CreateUser;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, ErrorOr<User>>
{
    private readonly IUsersRepository _UsersRepository;

    public CreateUserCommandHandler(IUsersRepository usersRepository)
    {
        _UsersRepository = usersRepository;
    }

    public async Task<ErrorOr<User>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var User = new User(request.fullname, request.email, request.phoneNumber, request.birthday,
                                 request.address, request.sex, request.avatar,request.accountId, request.roleId);
            await _UsersRepository.AddAsync(User, cancellationToken);
            return User;
        }
        catch (ArgumentException ex)
        {
            return Error.Failure(description: ex.Message);
        }
    }
}