using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Customer;

namespace SmartChain.Application.Customers.Queries.GetCustomerById;

public class GetCustomerByIdQueryHandler : IRequestHandler<GetCustomerByIdQuery, ErrorOr<Customer>>
{
    private readonly ICustomersRepository _CustomersRepository;

    public GetCustomerByIdQueryHandler(ICustomersRepository CustomersRepository)
    {
        _CustomersRepository = CustomersRepository;
    }

    public async Task<ErrorOr<Customer>> Handle(GetCustomerByIdQuery request, CancellationToken cancellationToken)
    {
        var Customer = await _CustomersRepository.GetByIdAsync(request.CustomerId, cancellationToken);
        if (Customer is null)
        {
            return Error.NotFound(description: "Customer not found.");
        }

        return Customer;
    }
}