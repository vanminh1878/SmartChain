using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SmartChain.Domain.User;

namespace SmartChain.Application.Common.Interfaces;

public interface IUsersRepository
{
    Task AddAsync(User user, CancellationToken cancellationToken);
    Task<User?> GetByIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken);
    Task<User?> GetByAccountIdAsync(Guid accountId, CancellationToken cancellationToken);
    Task<List<User>> ListByRoleIdAsync(Guid roleId, CancellationToken cancellationToken);
    Task<List<User>> ListAllAsync(CancellationToken cancellationToken);
    Task RemoveAsync(User user, CancellationToken cancellationToken);
    Task RemoveRangeAsync(List<User> users, CancellationToken cancellationToken);
    Task UpdateAsync(User user, CancellationToken cancellationToken);
}