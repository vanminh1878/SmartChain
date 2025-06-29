using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Customer;
using SmartChain.Domain.Account;

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
            .HasColumnType("nvarchar(50)");

        // Thuộc tính Email
        builder.Property(c => c.Email)
            .IsRequired()
            .HasMaxLength(150)
            .HasColumnType("nvarchar(150)");

        // Đảm bảo Email là duy nhất
        builder.HasIndex(c => c.Email)
            .IsUnique();

        // Thuộc tính PhoneNumber
        builder.Property(c => c.PhoneNumber)
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)");

        // Thuộc tính Address
        builder.Property(c => c.Address)
            .HasMaxLength(255)
            .HasColumnType("nvarchar(255)");

        // Thuộc tính Status (bool sang tinyint)
        builder.Property(c => c.Status)
            .HasColumnType("bit")
            .HasDefaultValue(true); // Mặc định: active

        // Thuộc tính AccountId (Guid)
        builder.Property(c => c.AccountId)
            .IsRequired()
            .HasColumnName("Account_id")
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

        // Mối quan hệ khóa ngoại với Account
        builder.HasOne<Account>()
            .WithMany()
            .HasForeignKey(c => c.AccountId)
            .HasConstraintName("FK_Customer_Account");
    }
}