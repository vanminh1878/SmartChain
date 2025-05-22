using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Account;
using SmartChain.Domain.Role;
using SmartChain.Domain.User;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class UserConfigurations : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // Định nghĩa bảng
        builder.ToTable("User");

        // Khóa chính
        builder.HasKey(u => u.Id);

        // Ánh xạ Id (Guid)
        builder.Property(u => u.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()"); // Sinh Guid tự động

        // Thuộc tính Fullname
        builder.Property(u => u.Fullname)
            .IsRequired()
            .HasMaxLength(50)
            .HasColumnType("varchar(50)");

        // Thuộc tính Email
        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(150)
            .HasColumnType("varchar(150)");

        // Đảm bảo Email là duy nhất
        builder.HasIndex(u => u.Email)
            .IsUnique();

        // Thuộc tính PhoneNumber
        builder.Property(u => u.PhoneNumber)
            .HasMaxLength(20)
            .HasColumnType("varchar(20)");

        // Thuộc tính Birthday
        builder.Property(u => u.Birthday)
            .IsRequired()
            .HasColumnType("datetime");

        // Thuộc tính Address
        builder.Property(u => u.Address)
            .HasMaxLength(255)
            .HasColumnType("varchar(255)");

        // Thuộc tính Sex
        builder.Property(u => u.Sex)
            .IsRequired()
            .HasColumnType("tinyint(1)");

        // Thuộc tính Avatar
        builder.Property(u => u.Avatar)
            .HasMaxLength(500)
            .HasColumnType("varchar(500)");

        // Thuộc tính AccountId (Guid)
        builder.Property(u => u.AccountId)
            .IsRequired()
            .HasColumnName("Account_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính RoleId (Guid)
        builder.Property(u => u.RoleId)
            .IsRequired()
            .HasColumnName("Role_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính CreatedAt
        builder.Property(u => u.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        // Thuộc tính UpdatedAt
        builder.Property(u => u.UpdatedAt)
            .IsRequired(false) // Nullable
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");

        // Mối quan hệ khóa ngoại với Account
        builder.HasOne<Account>()
            .WithMany()
            .HasForeignKey(u => u.AccountId)
            .HasConstraintName("FK_User_Account");

        // Mối quan hệ khóa ngoại với Role
        builder.HasOne<Role>()
            .WithMany()
            .HasForeignKey(u => u.RoleId)
            .HasConstraintName("FK_User_Role");
    }
}