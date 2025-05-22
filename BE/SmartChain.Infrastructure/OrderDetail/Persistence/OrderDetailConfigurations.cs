using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Order;
using SmartChain.Domain.Product;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class OrderDetailConfigurations : IEntityTypeConfiguration<OrderDetail>
{
    public void Configure(EntityTypeBuilder<OrderDetail> builder)
    {
        // Định nghĩa bảng
        builder.ToTable("Order_Detail");

        // Khóa chính
        builder.HasKey(od => od.Id);

        // Ánh xạ Id (Guid)
        builder.Property(od => od.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()"); // Sinh Guid tự động

        // Thuộc tính ProductId (Guid)
        builder.Property(od => od.ProductId)
            .IsRequired()
            .HasColumnName("Product_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính Quantity
        builder.Property(od => od.Quantity)
            .IsRequired()
            .HasColumnType("int");

        // Thuộc tính UnitPrice
        builder.Property(od => od.UnitPrice)
            .IsRequired()
            .HasColumnType("decimal(10,2)");

        // Thuộc tính CreatedAt
        builder.Property(od => od.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        // Thuộc tính UpdatedAt
        builder.Property(od => od.UpdatedAt)
            .IsRequired(false) // Nullable
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");

        // Mối quan hệ khóa ngoại với Product
        builder.HasOne<Product>()
            .WithMany()
            .HasForeignKey(od => od.ProductId)
            .HasConstraintName("FK_OrderDetail_Product");

        // Mối quan hệ khóa ngoại với Order (giả sử OrderDetail có OrderId)
        builder.HasOne<Order>()
            .WithMany(o => o.OrderDetails)
            .HasForeignKey("OrderId") // Giả sử OrderDetail có thuộc tính OrderId
            .HasConstraintName("FK_OrderDetail_Order")
            .OnDelete(DeleteBehavior.Cascade); // Xóa Order thì xóa luôn OrderDetail
    }
}