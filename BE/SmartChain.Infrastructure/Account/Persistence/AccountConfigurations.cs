using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Account; // Giả sử bạn có namespace này cho entity Account

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class AccountConfigurations : IEntityTypeConfiguration<Account>
{
    public void Configure(EntityTypeBuilder<Account> builder)
    {
        // Định nghĩa bảng
        builder.ToTable("Account");

        // Khóa chính
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()");

        // Thuộc tính Username
        builder.Property(a => a.Username)
            .IsRequired()
            .HasMaxLength(50)
            .HasColumnType("varchar(50)");

        // Đảm bảo Username là duy nhất
        builder.HasIndex(a => a.Username)
            .IsUnique();

        // Thuộc tính Password
        builder.Property(a => a.Password)
            .IsRequired()
            .HasMaxLength(255)
            .HasColumnType("varchar(255)");

        // Thuộc tính Status (bool sang tinyint)
        builder.Property(a => a.Status)
            .HasColumnType("bit")
            .HasDefaultValue(true); // Mặc định: active

        // Thuộc tính CreatedAt
        builder.Property(a => a.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        // Thuộc tính UpdatedAt
        builder.Property(a => a.UpdatedAt)
            .IsRequired(false) // Nullable
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");
    }
}