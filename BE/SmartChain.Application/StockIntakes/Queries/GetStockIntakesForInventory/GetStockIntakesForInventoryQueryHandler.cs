using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.StockIntakes.Queries.GetStockIntakesForInventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartChain.Application.StockIntakes.Queries.GetStockIntakesForInventoryHandler;

public class GetStockIntakeForInventoryQueryHandler : IRequestHandler<GetStockIntakesForInventoryQuery, ErrorOr<List<StockIntakesForInventoryDto>>>
{
    private readonly IStockIntakesRepository _stockIntakesRepository;
    private readonly IUsersRepository _usersRepository;
    private readonly ISuppliersRepository _suppliersRepository;

    public GetStockIntakeForInventoryQueryHandler(
        IStockIntakesRepository stockIntakesRepository,
        IUsersRepository usersRepository,
        ISuppliersRepository suppliersRepository)
    {
        _stockIntakesRepository = stockIntakesRepository ?? throw new ArgumentNullException(nameof(stockIntakesRepository));
        _usersRepository = usersRepository ?? throw new ArgumentNullException(nameof(usersRepository));
        _suppliersRepository = suppliersRepository ?? throw new ArgumentNullException(nameof(suppliersRepository));
    }

    public async Task<ErrorOr<List<StockIntakesForInventoryDto>>> Handle(GetStockIntakesForInventoryQuery request, CancellationToken cancellationToken)
    {
        // Lấy dữ liệu từ các repository theo storeId
        var stockIntakes = await _stockIntakesRepository.ListAllAsync( cancellationToken);
        var users = await _usersRepository.ListAllAsync(cancellationToken);
        var suppliers = await _suppliersRepository.ListAllAsync(cancellationToken);

        // Kiểm tra dữ liệu null
        if (stockIntakes == null || !stockIntakes.Any())
        {
            return Error.NotFound(description: "Không tìm thấy phiếu nhập kho.");
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