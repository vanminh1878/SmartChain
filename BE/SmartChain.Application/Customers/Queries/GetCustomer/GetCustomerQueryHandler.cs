using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Customer;

namespace SmartChain.Application.Customers.Queries.GetCustomer;

public class GetCustomerQueryHandler : IRequestHandler<GetCustomerQuery, ErrorOr<List<Customer>>>
{
    private readonly ICustomersRepository _CustomersRepository;

    public GetCustomerQueryHandler(ICustomersRepository CustomersRepository)
    {
        _CustomersRepository = CustomersRepository;
    }

    public async Task<ErrorOr<List<Customer>>> Handle(GetCustomerQuery request, CancellationToken cancellationToken)
    {
        var Customer = await _CustomersRepository.ListAllAsync(cancellationToken);
        if (Customer is null)
        {
            return Error.NotFound(description: "Customer not found.");
        }

        return Customer;
    }
}