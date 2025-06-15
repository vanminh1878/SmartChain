using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Customer;
using SmartChain.Application.Customers.Queries.GetCustomerByAccountId;

namespace SmartChain.Application.Customers.Queries.GetCustomerByAccountId;

public class GetCustomerByAccountIdQueryHandler : IRequestHandler<GetCustomerByAccountIdQuery, ErrorOr<ProfileResponse>>
{
    private readonly ICustomersRepository _CustomersRepository;
    private readonly ICartsRepository _CartsRepository;
    private readonly IAccountsRepository _AccountsRepository;
    private readonly IEmployeesRepository _EmployeesRepository;

    public GetCustomerByAccountIdQueryHandler(ICustomersRepository CustomersRepository, ICartsRepository CartsRepository,
                                            IAccountsRepository accountsRepository, IEmployeesRepository employeesRepository)
    {
        _CustomersRepository = CustomersRepository;
        _CartsRepository = CartsRepository;
        _AccountsRepository = accountsRepository;
        _EmployeesRepository = employeesRepository;
    }

    public async Task<ErrorOr<ProfileResponse>> Handle(GetCustomerByAccountIdQuery request, CancellationToken cancellationToken)
    {
        var Customer = await _CustomersRepository.GetByAccountIdAsync(request.AccountId, cancellationToken);
        if (Customer is null)
        {
            return Error.NotFound(description: "Customer not found.");
        }
        var account = await _AccountsRepository.GetByIdAsync(request.AccountId, cancellationToken);
        if (account is null)
        {
            return Error.NotFound(description: "Account not found.");
        }
        var cart = await _CartsRepository.GetByCustomerIdAsync(Customer.Id, cancellationToken);
        if (cart is null)
        {
            return Error.NotFound(description: "cart not found.");
        }
       
        // Tạo DTO
        var response = new ProfileResponse(Customer.Fullname, Customer.Email, Customer.PhoneNumber, Customer.Address,Customer.Id, cart.StoreId,cart.Id);

        return response; 
    }
}