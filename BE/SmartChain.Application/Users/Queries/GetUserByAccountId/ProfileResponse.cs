namespace SmartChain.Application.Users.Queries.GetUserByAccountId;

    public record ProfileResponse(
        string Username,
        string Fullname,
        string Email,
        string PhoneNumber,
        DateTime? Birthday,
        string Address,
        bool Sex,
        string Avatar,
        string RoleName,
        Guid StoreId,
        Guid UserId);
