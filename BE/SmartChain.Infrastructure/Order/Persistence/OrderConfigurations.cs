using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Customer;
using SmartChain.Domain.Order;
using SmartChain.Domain.Store;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class OrderConfigurations : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        // Định nghĩa bảng
        builder.ToTable("Order");

        // Khóa chính
        builder.HasKey(o => o.Id);

        // Ánh xạ Id (Guid)
        builder.Property(o => o.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()"); // Sinh Guid tự động

        // Thuộc tính CustomerId (Guid, nullable)
        builder.Property(o => o.CustomerId)
            .IsRequired(false) // Cho phép null
            .HasColumnName("Customer_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính StoreId (Guid)
        builder.Property(o => o.StoreId)
            .IsRequired()
            .HasColumnName("Store_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính TotalAmount
        builder.Property(o => o.TotalAmount)
            .IsRequired()
            .HasColumnType("decimal(10,2)");

        // Thuộc tính Status
        builder.Property(o => o.Status)
            .IsRequired()
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)");

        // Thuộc tính CreatedAt
        builder.Property(o => o.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        // Thuộc tính UpdatedAt
        builder.Property(o => o.UpdatedAt)
            .IsRequired(false) // Nullable
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");

        // Mối quan hệ khóa ngoại với Customer (nullable)
        builder.HasOne<Customer>()
            .WithMany()
            .HasForeignKey(o => o.CustomerId)
            .HasConstraintName("FK_Order_Customer")
            .IsRequired(false) // Không bắt buộc khóa ngoại
            .OnDelete(DeleteBehavior.SetNull); // Nếu Customer bị xóa, đặt CustomerId thành null

        // Mối quan hệ khóa ngoại với Store
        builder.HasOne<Store>()
            .WithMany()
            .HasForeignKey(o => o.StoreId)
            .HasConstraintName("FK_Order_Store")
            .OnDelete(DeleteBehavior.Restrict);

        // Mối quan hệ một-nhiều với OrderDetail
        builder.HasMany(o => o.OrderDetails)
            .WithOne()
            .HasForeignKey("OrderId")
            .HasConstraintName("FK_OrderDetail_Order")
            .OnDelete(DeleteBehavior.Cascade); // Xóa Order thì xóa OrderDetail
    }
}