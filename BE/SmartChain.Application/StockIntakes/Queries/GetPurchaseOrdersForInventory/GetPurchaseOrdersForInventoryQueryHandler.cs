using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.StockIntakes.Queries.GetPurchaseOrdersForInventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SmartChain.Application.StockIntakes.Queries.GetPurchaseOrdersForInventoryHandler;

public class GetPurchaseOrdersForInventoryQueryHandler : IRequestHandler<GetPurchaseOrdersForInventoryQuery, ErrorOr<List<SupplierPurchaseOrdersDto>>>
{
    private readonly IStockIntakesRepository _stockIntakesRepository;
    private readonly IStockIntakeDetailsRepository _stockIntakeDetailsRepository;
    private readonly ISuppliersRepository _suppliersRepository;
    private readonly IStoresRepository _storesRepository;
    private readonly IProductsRepository _productsRepository;

    public GetPurchaseOrdersForInventoryQueryHandler(
        IStockIntakesRepository stockIntakesRepository,
        IStockIntakeDetailsRepository stockIntakeDetailsRepository,
        ISuppliersRepository suppliersRepository,
        IStoresRepository storesRepository,
        IProductsRepository productsRepository)
    {
        _stockIntakesRepository = stockIntakesRepository ?? throw new ArgumentNullException(nameof(stockIntakesRepository));
        _stockIntakeDetailsRepository = stockIntakeDetailsRepository ?? throw new ArgumentNullException(nameof(stockIntakeDetailsRepository));
        _suppliersRepository = suppliersRepository ?? throw new ArgumentNullException(nameof(suppliersRepository));
        _storesRepository = storesRepository ?? throw new ArgumentNullException(nameof(storesRepository));
        _productsRepository = productsRepository ?? throw new ArgumentNullException(nameof(productsRepository));
    }

    public async Task<ErrorOr<List<SupplierPurchaseOrdersDto>>> Handle(GetPurchaseOrdersForInventoryQuery request, CancellationToken cancellationToken)
    {
        // Lấy dữ liệu từ các repository
        var stockIntakeDetails = await _stockIntakeDetailsRepository.ListAllAsync(cancellationToken);
        var stockIntakes = await _stockIntakesRepository.ListAllAsync(cancellationToken);
        var suppliers = await _suppliersRepository.ListAllAsync(cancellationToken);
        var stores = await _storesRepository.ListAllAsync(cancellationToken);
        var products = await _productsRepository.ListAllAsync(cancellationToken);

        // Kiểm tra dữ liệu null
        if (stockIntakeDetails == null || !stockIntakeDetails.Any())
        {
            return Error.NotFound(description: "Không tìm thấy chi tiết phiếu nhập kho.");
        }

        // Nhóm dữ liệu theo SupplierId và IntakeDate từ Stock_Intake_Detail
        var groupedResult = stockIntakeDetails
            .GroupBy(sid => new { sid.SupplierId, sid.IntakeDate })
            .Select(g =>
            {
                var supplier = suppliers?.FirstOrDefault(s => s.Id == g.Key.SupplierId);

                // Lấy danh sách các cửa hàng liên quan
                var purchaseOrders = g
                    .GroupBy(sid => sid.StoreId)
                    .Select(storeGroup =>
                    {
                        var store = stores?.FirstOrDefault(s => s.Id == storeGroup.Key);

                        // Lấy chi tiết sản phẩm
                        var productDetails = storeGroup.Select(sid =>
                        {
                            var product = products?.FirstOrDefault(p => p.Id == sid.ProductId);
                            return new SupplierPurchaseOrdersDto.ProductDetailDto
                            {
                                ProductName = product?.Name ?? "Không xác định",
                                Quantity = sid.Quantity
                            };
                        }).ToList();

                        // Tính tổng số tiền cho cửa hàng
                        var totalAmountPerStore = storeGroup.Sum(sid => sid.UnitPrice * sid.Quantity);

                        return new SupplierPurchaseOrdersDto.StorePurchaseOrderDto
                        {
                            StoreName = store?.Name ?? "Không xác định",
                            Products = productDetails,
                            TotalAmountPerStore = totalAmountPerStore
                        };
                    }).ToList();

                // Tính tổng số tiền cho Supplier
                var totalAmount = purchaseOrders.Sum(po => po.TotalAmountPerStore);

                return new SupplierPurchaseOrdersDto
                {
                    SupplierId = g.Key.SupplierId,
                    Supplier = supplier?.Name ?? "Không xác định",
                    IntakeDate = g.Key.IntakeDate,
                    PurchaseOrders = purchaseOrders,
                    TotalAmount = totalAmount
                };
            })
            .OrderBy(dto => dto.Supplier)
            .ThenBy(dto => dto.IntakeDate)
            .ToList();

        return groupedResult;
    }
}