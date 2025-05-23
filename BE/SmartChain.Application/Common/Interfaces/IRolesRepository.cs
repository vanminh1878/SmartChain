using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SmartChain.Domain.Role;

namespace SmartChain.Application.Common.Interfaces;

public interface IRolesRepository
{
    Task AddAsync(Role role, CancellationToken cancellationToken);
    Task<Role?> GetByIdAsync(Guid roleId, CancellationToken cancellationToken);
    Task<Role?> GetByNameAsync(string name, CancellationToken cancellationToken);
    Task<List<Role>> ListAllAsync(CancellationToken cancellationToken);
    Task RemoveAsync(Role role, CancellationToken cancellationToken);
    Task RemoveRangeAsync(List<Role> roles, CancellationToken cancellationToken);
    Task UpdateAsync(Role role, CancellationToken cancellationToken);
}