namespace SmartChain.Application.Customers.Queries.GetCustomerByAccountId;

    public record ProfileResponse(
        string Fullname,
        string Email,
        string PhoneNumber,
        string Address,
        Guid CustomerId,
        Guid StoreId,
        Guid CartId);
