using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Role;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class RoleConfigurations : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        // Định nghĩa bảng
        builder.ToTable("Role");

        // Khóa chính
        builder.HasKey(r => r.Id);

        // Ánh xạ Id (Guid)
        builder.Property(r => r.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()"); // Sinh Guid tự động

        // Thuộc tính Name
        builder.Property(r => r.Name)
            .IsRequired()
            .HasMaxLength(20)
            .HasColumnType("varchar(20)");

        // Thuộc tính CreatedAt
        builder.Property(r => r.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        // Thuộc tính UpdatedAt
        builder.Property(r => r.UpdatedAt)
            .IsRequired(false) // Nullable
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");
    }
}