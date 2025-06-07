using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.StockIntakes.Queries.GetStockIntakesForInventory;
using SmartChain.Domain.StockIntake;
using SmartChain.Infrastructure.Common.Persistence;

namespace SmartChain.Infrastructure.Persistence.Repositories;

public class StockIntakesRepository : IStockIntakesRepository
{
    private readonly AppDbContext _context;
    private readonly IStockIntakeDetailsRepository _stockIntakeDetailsRepository;
    private readonly ISuppliersRepository _suppliersRepository;
    private readonly IUsersRepository _usersRepository;

    public StockIntakesRepository(
        AppDbContext context,
        IStockIntakeDetailsRepository stockIntakeDetailsRepository,
        ISuppliersRepository suppliersRepository,
        IUsersRepository usersRepository)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _stockIntakeDetailsRepository = stockIntakeDetailsRepository ?? throw new ArgumentNullException(nameof(stockIntakeDetailsRepository));
        _suppliersRepository = suppliersRepository ?? throw new ArgumentNullException(nameof(suppliersRepository));
        _usersRepository = usersRepository ?? throw new ArgumentNullException(nameof(usersRepository));
    }

    public async Task AddAsync(StockIntake stockIntake, CancellationToken cancellationToken)
    {
        await _context.StockIntakes.AddAsync(stockIntake ?? throw new ArgumentNullException(nameof(stockIntake)), cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<StockIntake?> GetByIdAsync(Guid stockIntakeId, CancellationToken cancellationToken)
    {
        return await _context.StockIntakes
            .Include(si => si.StockIntakeDetails)
            .FirstOrDefaultAsync(si => si.Id == stockIntakeId, cancellationToken);
    }

    public async Task<List<StockIntake>> ListByStoreIdAsync(Guid storeId, CancellationToken cancellationToken)
    {
        return await _context.StockIntakes
            .Where(si => si.StoreId == storeId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<StockIntake>> ListBySupplierIdAsync(Guid supplierId, CancellationToken cancellationToken)
    {
        return await _context.StockIntakes
            .Where(si => si.SupplierId == supplierId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<StockIntake>> ListByCreatedByAsync(Guid createdBy, CancellationToken cancellationToken)
    {
        return await _context.StockIntakes
            .Where(si => si.CreatedBy == createdBy)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<StockIntake>> ListByStatusAsync(int status, CancellationToken cancellationToken)
    {
        return await _context.StockIntakes
            .Where(si => si.Status == status)
            .ToListAsync(cancellationToken);
    }

    public async Task RemoveAsync(StockIntake stockIntake, CancellationToken cancellationToken)
    {
        _context.StockIntakes.Remove(stockIntake ?? throw new ArgumentNullException(nameof(stockIntake)));
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRangeAsync(List<StockIntake> stockIntakes, CancellationToken cancellationToken)
    {
        if (stockIntakes == null || !stockIntakes.Any())
            return;

        _context.StockIntakes.RemoveRange(stockIntakes);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(StockIntake stockIntake, CancellationToken cancellationToken)
    {
        _context.StockIntakes.Update(stockIntake ?? throw new ArgumentNullException(nameof(stockIntake)));
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<StockIntake>> ListAllAsync(CancellationToken cancellationToken)
    {
        return await _context.StockIntakes
            .Include(si => si.StockIntakeDetails)
            .ToListAsync(cancellationToken);
    }

   public async Task<List<StockIntakesForInventoryDto>> GetStockIntakesForInventoryAsync(Guid storeId, CancellationToken cancellationToken)
    {
        // Lấy dữ liệu từ các repository theo storeId
        var stockIntakes = await ListByStoreIdAsync(storeId, cancellationToken);
        var users = await _usersRepository.ListAllAsync(cancellationToken);
        var suppliers = await _suppliersRepository.ListAllAsync(cancellationToken);

        // Kiểm tra dữ liệu null
        if (stockIntakes == null || !stockIntakes.Any())
        {
            return new List<StockIntakesForInventoryDto>();
        }

        // Ánh xạ dữ liệu vào DTO
        var result = stockIntakes.Select(si =>
        {
            // Tìm người tạo
            var createdByUser = users?.FirstOrDefault(u => u.Id == si.CreatedBy);

            // Tìm người phê duyệt
            var approvedByUser = si.ApprovedBy != null 
                ? users?.FirstOrDefault(u => u.Id == si.ApprovedBy)
                : null;

            // Tìm nhà cung cấp
            var supplier = suppliers?.FirstOrDefault(s => s.Id == si.SupplierId);

            return new StockIntakesForInventoryDto
            {
                StockIntakeId = si.Id,
                supplier = supplier?.Name ?? "Không xác định",
                IntakeDate = si.IntakeDate,
                Created_By_Name = createdByUser?.Fullname ?? "Không xác định",
                Status = si.Status,
                Approved_By_Name = approvedByUser?.Fullname ?? "Không xác định"
            };
        }).ToList();

        return result;
    }
}