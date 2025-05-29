using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Customer;

namespace SmartChain.Application.Customers.Commands.CreateCustomer;

public class CreateCustomerCommandHandler : IRequestHandler<CreateCustomerCommand, ErrorOr<Customer>>
{
    private readonly ICustomersRepository _CustomersRepository;

    public CreateCustomerCommandHandler(ICustomersRepository CustomersRepository)
    {
        _CustomersRepository = CustomersRepository;
    }

    public async Task<ErrorOr<Customer>> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var Customer = new Customer(request.fullname, request.email, request.phoneNumber, request.address, request.accountId);
            await _CustomersRepository.AddAsync(Customer, cancellationToken);
            return Customer;
        }
        catch (ArgumentException ex)
        {
            return Error.Failure(description: ex.Message);
        }
    }
}