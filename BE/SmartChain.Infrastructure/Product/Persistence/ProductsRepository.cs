using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.Products.Queries.GetProductForInventory;
using SmartChain.Domain.Categories;
using SmartChain.Domain.Product;
using SmartChain.Infrastructure.Common.Persistence;

namespace SmartChain.Infrastructure.Persistence.Repositories;

public class ProductsRepository : IProductsRepository
{
    private readonly AppDbContext _context;
    private readonly ICategoriesRepository _categoriesRepository;
    private readonly IStoresRepository _storesRepository;
    private readonly ISuppliersRepository _suppliersRepository;
    private readonly IStockIntakesRepository _stockIntakesRepository;
    private readonly IStockIntakeDetailsRepository _stockIntakeDetailsRepository;

    public ProductsRepository(
        AppDbContext context,
        ICategoriesRepository categoriesRepository,
        IStoresRepository storesRepository,
        ISuppliersRepository suppliersRepository,
        IStockIntakesRepository stockIntakesRepository,
        IStockIntakeDetailsRepository stockIntakeDetailsRepository)
    {
        _context = context;
        _categoriesRepository = categoriesRepository;
        _storesRepository = storesRepository;
        _suppliersRepository = suppliersRepository;
        _stockIntakesRepository = stockIntakesRepository;
        _stockIntakeDetailsRepository = stockIntakeDetailsRepository;
    }

    public async Task AddAsync(Product product, CancellationToken cancellationToken)
    {
        await _context.Products.AddAsync(product, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Product?> GetByIdAsync(Guid productId, CancellationToken cancellationToken)
    {
        return await _context.Products
            .FirstOrDefaultAsync(p => p.Id == productId, cancellationToken);
    }

    public async Task<Category> GetCategoryByProductIdAsync(Guid productId, CancellationToken cancellationToken)
    {
        return await (from product in _context.Products
                      join cat in _context.Categories
                      on product.CategoryId equals cat.Id
                      where product.Id == productId
                      select cat)
                      .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<List<Product>> ListAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Products
            .ToListAsync(cancellationToken);
    }

    // public async Task<List<Product>> ListByStoreIdAsync(Guid storeId, CancellationToken cancellationToken)
    // {
    //     return await _context.Products
    //         .Where(p => p.StoreId == storeId)
    //         .ToListAsync(cancellationToken);
    // }

    public async Task<List<Product>> ListByCategoryIdAsync(Guid categoryId, CancellationToken cancellationToken)
    {
        return await _context.Products
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync(cancellationToken);
    }

    public async Task RemoveAsync(Product product, CancellationToken cancellationToken)
    {
        _context.Products.Remove(product);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRangeAsync(List<Product> products, CancellationToken cancellationToken)
    {
        _context.Products.RemoveRange(products);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Product product, CancellationToken cancellationToken)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<ProductForInventoryDto>> GetProductsForInventoryAsync(CancellationToken cancellationToken)
    {
        // Lấy dữ liệu từ các repository
        var products = await ListAllAsync(cancellationToken);
        var categories = await _categoriesRepository.ListAllAsync(cancellationToken);
        var stores = await _storesRepository.ListAllAsync(cancellationToken);
        var suppliers = await _suppliersRepository.ListAllAsync(cancellationToken);
        var stockIntakes = await _stockIntakesRepository.ListAllAsync(cancellationToken);
        var stockIntakeDetails = await _stockIntakeDetailsRepository.ListAllAsync(cancellationToken);

        // Kiểm tra dữ liệu null
        if (products == null || !products.Any())
        {
            return new List<ProductForInventoryDto>();
        }

        // Ánh xạ dữ liệu vào DTO
        var result = products.Select(p =>
        {
            // Tìm StockIntakeDetail mới nhất cho sản phẩm
            var stockDetail = stockIntakeDetails
                ?.Where(sid => sid.ProductId == p.Id)
                .OrderByDescending(sid => sid.CreatedAt)
                .FirstOrDefault();

            // Tìm StockIntake liên quan
            var stockIntake = stockDetail != null
                ? stockIntakes?.FirstOrDefault(si => si.Id == stockDetail.StockIntakeId)
                : null;



            return new ProductForInventoryDto
            {
                TenSanPham = p.Name,
                DanhMuc = categories?.FirstOrDefault(c => c.Id == p.CategoryId)?.Name ?? "Không xác định",
                GiaNhap = stockDetail?.UnitPrice ?? 0,
                GiaBan = p.Price ?? 0,
                TonKho = p.StockQuantity,
                ProductId = p.Id
            };
        }).ToList();

        return result;
    }
}