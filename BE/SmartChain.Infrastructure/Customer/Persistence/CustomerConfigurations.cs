using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Customer;
using SmartChain.Domain.Store;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class CustomerConfigurations : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        // Định nghĩa bảng
        builder.ToTable("Customer");

        // Khóa chính
        builder.HasKey(c => c.Id);

        // Ánh xạ Id (Guid)
        builder.Property(c => c.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()"); // Sinh Guid tự động

        // Thuộc tính Fullname
        builder.Property(c => c.Fullname)
            .IsRequired()
            .HasMaxLength(50)
            .HasColumnType("varchar(50)");

        // Thuộc tính Email
        builder.Property(c => c.Email)
            .IsRequired()
            .HasMaxLength(150)
            .HasColumnType("varchar(150)");

        // Đảm bảo Email là duy nhất
        builder.HasIndex(c => c.Email)
            .IsUnique();

        // Thuộc tính PhoneNumber
        builder.Property(c => c.PhoneNumber)
            .HasMaxLength(20)
            .HasColumnType("varchar(20)");

        // Thuộc tính Address
        builder.Property(c => c.Address)
            .HasMaxLength(255)
            .HasColumnType("varchar(255)");

        // Thuộc tính Status (bool sang tinyint)
        builder.Property(c => c.Status)
            .HasColumnType("bit")
            .HasDefaultValue(true); // Mặc định: active

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
            .IsRequired(false) // Nullable
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");

        // Mối quan hệ khóa ngoại với Store
        builder.HasOne<Store>()
            .WithMany()
            .HasForeignKey(c => c.StoreId)
            .HasConstraintName("FK_Customer_Store");
    }
}