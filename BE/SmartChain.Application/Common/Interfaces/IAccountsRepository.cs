using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SmartChain.Domain.Account;

namespace SmartChain.Application.Common.Interfaces;

public interface IAccountsRepository
{
    Task AddAsync(Account account, CancellationToken cancellationToken);
    Task<Account?> GetByIdAsync(Guid accountId, CancellationToken cancellationToken);
    Task<Account?> GetByUsernameAsync(string username, CancellationToken cancellationToken);
    Task<List<Account>> ListByStatusAsync(bool status, CancellationToken cancellationToken);
    Task RemoveAsync(Account account, CancellationToken cancellationToken);
    Task RemoveRangeAsync(List<Account> accounts, CancellationToken cancellationToken);
    Task UpdateAsync(Account account, CancellationToken cancellationToken);
}