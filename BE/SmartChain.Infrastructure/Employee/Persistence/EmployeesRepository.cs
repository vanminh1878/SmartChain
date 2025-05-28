using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Employee;
using SmartChain.Infrastructure.Common.Persistence;
namespace SmartChain.Infrastructure.Persistence.Repositories;

public class EmployeesRepository : IEmployeesRepository
{
    private readonly AppDbContext _context;

    public EmployeesRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Employee employee, CancellationToken cancellationToken)
    {
        await _context.Employees.AddAsync(employee, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Employee?> GetByIdAsync(Guid employeeId, CancellationToken cancellationToken)
    {
        return await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == employeeId, cancellationToken);
    }

    public async Task<Employee?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await _context.Employees
            .FirstOrDefaultAsync(e => e.UserId == userId, cancellationToken);
    }
        public async Task<List<Employee>> ListAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Employees
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Employee>> ListByStoreIdAsync(Guid storeId, CancellationToken cancellationToken)
    {
        return await _context.Employees
            .Where(e => e.StoreId == storeId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Employee>> ListByStatusAsync(bool status, CancellationToken cancellationToken)
    {
        return await _context.Employees
            .Where(e => e.Status == status)
            .ToListAsync(cancellationToken);
    }

    public async Task RemoveAsync(Employee employee, CancellationToken cancellationToken)
    {
        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRangeAsync(List<Employee> employees, CancellationToken cancellationToken)
    {
        _context.Employees.RemoveRange(employees);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Employee employee, CancellationToken cancellationToken)
    {
        _context.Employees.Update(employee);
        await _context.SaveChangesAsync(cancellationToken);
    }
}