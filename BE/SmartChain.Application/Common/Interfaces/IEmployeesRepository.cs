using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SmartChain.Domain.Employee;

namespace SmartChain.Application.Common.Interfaces;

public interface IEmployeesRepository
{
    Task AddAsync(Employee employee, CancellationToken cancellationToken);
    Task<Employee?> GetByIdAsync(Guid employeeId, CancellationToken cancellationToken);
    Task<Employee?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<List<Employee>> ListAllAsync(CancellationToken cancellationToken);
    Task<List<Employee>> ListByStoreIdAsync(Guid storeId, CancellationToken cancellationToken);
    Task<List<Employee>> ListByStatusAsync(bool status, CancellationToken cancellationToken);
    Task RemoveAsync(Employee employee, CancellationToken cancellationToken);
    Task RemoveRangeAsync(List<Employee> employees, CancellationToken cancellationToken);
    Task UpdateAsync(Employee employee, CancellationToken cancellationToken);
}