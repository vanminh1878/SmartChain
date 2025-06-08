using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.User;

namespace SmartChain.Application.Users.Commands.UpdateUser;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, ErrorOr<Success>>
{
    private readonly IUsersRepository _UsersRepository;

    public UpdateUserCommandHandler(IUsersRepository usersRepository)
    {
        _UsersRepository = usersRepository;
    }

    public async Task<ErrorOr<Success>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {

        var user = await _UsersRepository.GetByAccountIdAsync(request.AccountId, cancellationToken);
        if (user is null)
        {
            return Error.NotFound(description: "User not found.");
        }

        var result = user.Update(request.fullname, request.email, request.phoneNumber,  request.birthday,
                            request.address, request.sex, request.avatar);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _UsersRepository.UpdateAsync(user, cancellationToken);
        return Result.Success;
    }
}