using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Cart;
using SmartChain.Domain.Product;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class CartDetailConfigurations : IEntityTypeConfiguration<CartDetail>
{
    public void Configure(EntityTypeBuilder<CartDetail> builder)
    {
        // Định nghĩa bảng
        builder.ToTable("Cart_Detail");

        // Khóa chính
        builder.HasKey(cd => cd.Id);

        // Ánh xạ Id (Guid)
        builder.Property(cd => cd.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()"); // Sinh Guid tự động

        // Thuộc tính ProductId (Guid)
        builder.Property(cd => cd.ProductId)
            .IsRequired()
            .HasColumnName("Product_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính Quantity
        builder.Property(cd => cd.Quantity)
            .IsRequired()
            .HasColumnType("int");

        // Thuộc tính UnitPrice
        builder.Property(cd => cd.UnitPrice)
            .IsRequired()
            .HasColumnType("decimal(10,2)");

        // Thuộc tính CreatedAt
        builder.Property(cd => cd.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        // Thuộc tính UpdatedAt
        builder.Property(cd => cd.UpdatedAt)
            .IsRequired(false) // Nullable
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");

        // Mối quan hệ khóa ngoại với Product
        builder.HasOne<Product>()
            .WithMany()
            .HasForeignKey(cd => cd.ProductId)
            .HasConstraintName("FK_CartDetail_Product");

        // Mối quan hệ khóa ngoại với Cart (giả sử CartDetail có CartId)
        builder.HasOne<Cart>()
            .WithMany(c => c.CartDetails)
            .HasForeignKey("CartId") // Giả sử CartDetail có thuộc tính CartId
            .HasConstraintName("FK_CartDetail_Cart")
            .OnDelete(DeleteBehavior.Cascade); // Xóa Cart thì xóa luôn CartDetail
    }
}