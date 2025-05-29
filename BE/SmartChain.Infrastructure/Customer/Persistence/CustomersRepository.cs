using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Customer;
using SmartChain.Infrastructure.Common.Persistence;

namespace SmartChain.Infrastructure.Persistence.Repositories;

public class CustomersRepository : ICustomersRepository
{
    private readonly AppDbContext _context;

    public CustomersRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Customer customer, CancellationToken cancellationToken)
    {
        await _context.Customers.AddAsync(customer, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Customer?> GetByIdAsync(Guid customerId, CancellationToken cancellationToken)
    {
        return await _context.Customers
            .FirstOrDefaultAsync(c => c.Id == customerId, cancellationToken);
    }

    public async Task<Customer?> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        return await _context.Customers
            .FirstOrDefaultAsync(c => c.Email == email, cancellationToken);
    }

    public async Task<List<Customer>> ListByStatusAsync(bool status, CancellationToken cancellationToken)
    {
        return await _context.Customers
            .Where(c => c.Status == status)
            .ToListAsync(cancellationToken);
    }

    public async Task RemoveAsync(Customer customer, CancellationToken cancellationToken)
    {
        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRangeAsync(List<Customer> customers, CancellationToken cancellationToken)
    {
        _context.Customers.RemoveRange(customers);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Customer customer, CancellationToken cancellationToken)
    {
        _context.Customers.Update(customer);
        await _context.SaveChangesAsync(cancellationToken);
    }
}