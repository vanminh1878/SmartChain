using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Store;
using SmartChain.Domain.Supplier;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class SupplierConfigurations : IEntityTypeConfiguration<Supplier>
{
    public void Configure(EntityTypeBuilder<Supplier> builder)
    {
        // Định nghĩa bảng
        builder.ToTable("Supplier");

        // Khóa chính
        builder.HasKey(s => s.Id);

        // Ánh xạ Id (Guid)
        builder.Property(s => s.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()"); // Sinh Guid tự động

        // Thuộc tính Name
        builder.Property(s => s.Name)
            .IsRequired()
            .HasMaxLength(100)
            .HasColumnType("varchar(100)");

        // Thuộc tính Contact_name
        builder.Property(s => s.Contact_name)
            .IsRequired()
            .HasMaxLength(50)
            .HasColumnType("varchar(50)");

        // Thuộc tính PhoneNumber
        builder.Property(s => s.PhoneNumber)
            .IsRequired()
            .HasMaxLength(20)
            .HasColumnType("varchar(20)");

        // Thuộc tính Email
        builder.Property(s => s.Email)
            .IsRequired()
            .HasMaxLength(150)
            .HasColumnType("varchar(150)");

        // Thuộc tính Address
        builder.Property(s => s.Address)
            .IsRequired()
            .HasMaxLength(255)
            .HasColumnType("varchar(255)");

        // Thuộc tính Status
        builder.Property(s => s.Status)
            .HasColumnType("bit")
            .HasDefaultValue(true); // Mặc định: active

        // Thuộc tính StoreId (Guid)
        builder.Property(s => s.StoreId)
            .IsRequired()
            .HasColumnName("Store_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính CreatedAt
        builder.Property(s => s.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        // Thuộc tính UpdatedAt
        builder.Property(s => s.UpdatedAt)
            .IsRequired(false) // Nullable
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");

        // Mối quan hệ khóa ngoại với Store
        builder.HasOne<Store>()
            .WithMany()
            .HasForeignKey(s => s.StoreId)
            .HasConstraintName("FK_Supplier_Store")
            .OnDelete(DeleteBehavior.Restrict);
    }
}