using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Account;
using SmartChain.Infrastructure.Common.Persistence;

namespace SmartChain.Infrastructure.Persistence.Repositories;

public class AccountsRepository : IAccountsRepository
{
    private readonly AppDbContext _context;

    public AccountsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Account account, CancellationToken cancellationToken)
    {
        await _context.Accounts.AddAsync(account, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Account?> GetByIdAsync(Guid accountId, CancellationToken cancellationToken)
    {
        return await _context.Accounts
            .FirstOrDefaultAsync(a => a.Id == accountId, cancellationToken);
    }


    public async Task<Account?> GetByUsernameAsync(string username, CancellationToken cancellationToken)
    {
        return await _context.Accounts
            .FirstOrDefaultAsync(a => a.Username == username, cancellationToken);
    }

    public async Task<List<Account>> ListByStatusAsync(bool status, CancellationToken cancellationToken)
    {
        return await _context.Accounts
            .Where(a => a.Status == status)
            .ToListAsync(cancellationToken);
    }
    public async Task<List<Account>> ListAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Accounts
            .ToListAsync(cancellationToken);
    }

    public async Task RemoveAsync(Account account, CancellationToken cancellationToken)
    {
        _context.Accounts.Remove(account);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRangeAsync(List<Account> accounts, CancellationToken cancellationToken)
    {
        _context.Accounts.RemoveRange(accounts);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Account account, CancellationToken cancellationToken)
    {
        _context.Accounts.Update(account);
        await _context.SaveChangesAsync(cancellationToken);
    }
}