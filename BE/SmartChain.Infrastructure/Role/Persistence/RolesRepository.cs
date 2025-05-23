using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Role;
using SmartChain.Infrastructure.Common.Persistence;


namespace SmartChain.Infrastructure.Persistence.Repositories;

public class RolesRepository : IRolesRepository
{
    private readonly AppDbContext _context;

    public RolesRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Role role, CancellationToken cancellationToken)
    {
        await _context.Roles.AddAsync(role, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Role?> GetByIdAsync(Guid roleId, CancellationToken cancellationToken)
    {
        return await _context.Roles
            .FirstOrDefaultAsync(r => r.Id == roleId, cancellationToken);
    }

    public async Task<Role?> GetByNameAsync(string name, CancellationToken cancellationToken)
    {
        return await _context.Roles
            .FirstOrDefaultAsync(r => r.Name == name, cancellationToken);
    }

    public async Task<List<Role>> ListAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Roles
            .ToListAsync(cancellationToken);
    }

    public async Task RemoveAsync(Role role, CancellationToken cancellationToken)
    {
        _context.Roles.Remove(role);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRangeAsync(List<Role> roles, CancellationToken cancellationToken)
    {
        _context.Roles.RemoveRange(roles);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Role role, CancellationToken cancellationToken)
    {
        _context.Roles.Update(role);
        await _context.SaveChangesAsync(cancellationToken);
    }
}