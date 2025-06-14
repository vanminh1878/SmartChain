using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SmartChain.Domain.Cart;
using SmartChain.Domain.CartDetail; 
namespace SmartChain.Application.Common.Interfaces;

public interface ICartDetailsRepository
{
    Task AddAsync(CartDetail cartDetail, CancellationToken cancellationToken);
    Task<CartDetail?> GetByIdAsync(Guid cartDetailId, CancellationToken cancellationToken);
    Task<Cart?> GetCartByCartDetailIdAsync(Guid cartDetailId, CancellationToken cancellationToken);
    Task<List<CartDetail>> ListByCartIdAsync(Guid cartId, CancellationToken cancellationToken);
    /// Lấy danh sách chi tiết giỏ hàng theo ID sản phẩm để phân tích hành vi mua sắm, tình trạng tồn kho hay cập nhật giá sản phẩm,..
    Task<List<CartDetail>> ListByProductIdAsync(Guid productId, CancellationToken cancellationToken);
    Task<CartDetail?> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken);
    Task RemoveAsync(CartDetail cartDetail, CancellationToken cancellationToken);
     Task RemoveAllByCartIdAsync(Guid cartId, CancellationToken cancellationToken);
    Task RemoveRangeAsync(List<CartDetail> cartDetails, CancellationToken cancellationToken);
    Task UpdateAsync(CartDetail cartDetail, CancellationToken cancellationToken);
}