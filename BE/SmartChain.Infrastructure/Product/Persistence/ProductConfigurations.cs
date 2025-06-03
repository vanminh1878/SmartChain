using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Categories;
using SmartChain.Domain.Product;
using SmartChain.Domain.Store;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class ProductConfigurations : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        // Định nghĩa bảng
        builder.ToTable("Product");

        // Khóa chính
        builder.HasKey(p => p.Id);

        // Ánh xạ Id (Guid)
        builder.Property(p => p.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()"); // Sinh Guid tự động

        // Thuộc tính Name
        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(100)
            .HasColumnType("varchar(100)");

        // Thuộc tính Description
        builder.Property(p => p.Description)
            .HasColumnType("text");

        // Thuộc tính Price
        builder.Property(p => p.Price)
            .IsRequired()
            .HasColumnType("decimal(10,2)");

        // Thuộc tính StockQuantity
        builder.Property(p => p.StockQuantity)
            .IsRequired()
            .HasColumnType("int");
        //image
        builder.Property(p => p.Image)
                .IsRequired(false)
                .HasMaxLength(500)
                .HasColumnType("varchar(500)");
        // Thuộc tính CategoryId (Guid)
        builder.Property(p => p.CategoryId)
            .IsRequired()
            .HasColumnName("Category_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính StoreId (Guid)
        builder.Property(p => p.StoreId)
            .IsRequired()
            .HasColumnName("Store_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính CreatedAt
        builder.Property(p => p.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        // Thuộc tính UpdatedAt
        builder.Property(p => p.UpdatedAt)
            .IsRequired(false) // Nullable
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");

        // Mối quan hệ khóa ngoại với Category
        builder.HasOne<Category>()
            .WithMany()
            .HasForeignKey(p => p.CategoryId)
            .HasConstraintName("FK_Product_Category")
            .OnDelete(DeleteBehavior.Restrict);

        // Mối quan hệ khóa ngoại với Store
        builder.HasOne<Store>()
            .WithMany()
            .HasForeignKey(p => p.StoreId)
            .HasConstraintName("FK_Product_Store")
            .OnDelete(DeleteBehavior.Restrict);
    }
}