using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Cart;
using SmartChain.Domain.Customer;
using SmartChain.Domain.Store;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class CartConfigurations : IEntityTypeConfiguration<Cart>
{
    public void Configure(EntityTypeBuilder<Cart> builder)
    {
        // Định nghĩa bảng
        builder.ToTable("Cart");

        // Khóa chính
        builder.HasKey(c => c.Id);

        // Ánh xạ Id (Guid)
        builder.Property(c => c.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()");

        // Thuộc tính CustomerId (Guid, nullable)
        builder.Property(c => c.CustomerId)
            .IsRequired(false)
            .HasColumnName("Customer_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính StoreId (Guid)
        builder.Property(c => c.StoreId)
            .IsRequired()
            .HasColumnName("Store_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính CreatedAt
        builder.Property(c => c.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        // Thuộc tính UpdatedAt
        builder.Property(c => c.UpdatedAt)
            .IsRequired(false)
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");

        // Thuộc tính RowVersion
        // builder.Property(c => c.RowVersion)
        //     .IsRowVersion()
        //     .IsConcurrencyToken()
        //     .HasColumnName("RowVersion");

        // Thêm chỉ mục duy nhất trên cặp CustomerId và StoreId
        builder.HasIndex(c => new { c.CustomerId, c.StoreId })
            .IsUnique()
            .HasDatabaseName("IX_Cart_CustomerId_StoreId_Unique");

        // Mối quan hệ khóa ngoại với Customer (cho phép NULL)
        builder.HasOne<Customer>()
            .WithOne()
            .HasForeignKey<Cart>(c => c.CustomerId)
            .HasConstraintName("FK_Cart_Customer")
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);

        // Mối quan hệ khóa ngoại với Store
        builder.HasOne<Store>()
            .WithMany()
            .HasForeignKey(c => c.StoreId)
            .HasConstraintName("FK_Cart_Store")
            .OnDelete(DeleteBehavior.Restrict);

        // Mối quan hệ một-nhiều với CartDetail
        builder.HasMany(c => c.CartDetails)
            .WithOne()
            .HasForeignKey("CartId")
            .HasConstraintName("FK_CartDetail_Cart")
            .OnDelete(DeleteBehavior.Cascade);
    }
}