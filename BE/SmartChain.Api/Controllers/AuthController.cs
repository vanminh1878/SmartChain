// Presentation/Controllers/AuthController.cs
using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Auth;
using SmartChain.Application.Auth.Commands;
using SmartChain.Application.Auth.Queries;
using SmartChain.Application.Auth;
using SmartChain.Domain.Account;

namespace SmartChain.Api.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ApiController
    {
        private readonly ISender _mediator;

        public AuthController(ISender mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request, CancellationToken cancellationToken)
        {
            var command = new RegisterCommand(
                request.Username,
                request.Password,
                request.Fullname,
                request.Email,
                request.PhoneNumber,
                request.Birthday,
                request.Address,
                request.Sex,
                request.Avatar,
                request.Role);

            ErrorOr<Account> result = await _mediator.Send(command, cancellationToken);

            return result.Match(
                account => CreatedAtAction(
                    actionName: nameof(Register), // Có thể thay bằng API lấy thông tin account nếu có
                    routeValues: new { accountId = account.Id },
                    value: new { Message = "Đăng ký thành công", AccountId = account.Id }),
                Problem);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request, CancellationToken cancellationToken)
        {
            var query = new LoginQuery(request.Username, request.Password);
            ErrorOr<LoginResponse> result = await _mediator.Send(query, cancellationToken);

            return result.Match(
                response => Ok(response),
                Problem);
        }
         [HttpPost("update-password")]
        public async Task<IActionResult> UpdatePassword(UpdatePasswordRequest request, CancellationToken cancellationToken)
        {
            var command = new UpdatePasswordCommand(request.Username, request.NewPassword);
            ErrorOr<Account> result = await _mediator.Send(command, cancellationToken);

            return result.Match(
                account => Ok(new { Message = "Cập nhật mật khẩu thành công", AccountId = account.Id }),
                Problem);
        }
    }
}