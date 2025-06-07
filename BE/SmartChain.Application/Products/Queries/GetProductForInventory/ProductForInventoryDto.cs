namespace SmartChain.Application.Products.Queries.GetProductForInventory;

public class ProductForInventoryDto
{
    public string TenSanPham { get; set; }
    public string DanhMuc { get; set; }
    public string NhaCungCap { get; set; }
    public string CuaHang { get; set; }
    public decimal GiaNhap { get; set; }
    public decimal GiaBan { get; set; }
    public int TonKho { get; set; }
    public Guid StoreId { get; set; }
    public Guid ProductId { get; set; }
}