using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Customer;

namespace SmartChain.Application.Customers.Commands.UpdateCustomer;

public class UpdateCustomerCommandHandler : IRequestHandler<UpdateCustomerCommand, ErrorOr<Success>>
{
    private readonly ICustomersRepository _CustomersRepository;

    public UpdateCustomerCommandHandler(ICustomersRepository CustomersRepository)
    {
        _CustomersRepository = CustomersRepository;
    }

    public async Task<ErrorOr<Success>> Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
    {
        var Customer = await _CustomersRepository.GetByIdAsync(request.CustomerId, cancellationToken);
        if (Customer is null)
        {
            return Error.NotFound(description: "Customer not found.");
        }

        var result = Customer.Update(request.fullname, request.email, request.phoneNumber, request.address);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _CustomersRepository.UpdateAsync(Customer, cancellationToken);
        return Result.Success;
    }
}