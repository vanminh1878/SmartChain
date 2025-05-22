using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Store;
using SmartChain.Domain.User;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class StoreConfigurations : IEntityTypeConfiguration<Store>
{
    public void Configure(EntityTypeBuilder<Store> builder)
    {
        // Định nghĩa bảng
        builder.ToTable("Store");

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

        // Thuộc tính Address
        builder.Property(s => s.Address)
            .HasMaxLength(255)
            .HasColumnType("varchar(255)");

        // Thuộc tính PhoneNumber
        builder.Property(s => s.PhoneNumber)
            .HasMaxLength(20)
            .HasColumnType("varchar(20)");

        // Thuộc tính Email
        builder.Property(s => s.Email)
            .IsRequired()
            .HasMaxLength(150)
            .HasColumnType("varchar(150)");

        // Đảm bảo Email là duy nhất
        builder.HasIndex(s => s.Email)
            .IsUnique();

        // Thuộc tính Status
        builder.Property(s => s.Status)
            .HasColumnType("bit")
            .HasDefaultValue(true); // Mặc định: active

        // Thuộc tính OwnerId (Guid)
        builder.Property(s => s.OwnerId)
            .IsRequired()
            .HasColumnName("Owner_id")
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

        // Mối quan hệ khóa ngoại với User (Owner)
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(s => s.OwnerId)
            .HasConstraintName("FK_Store_User")
            .OnDelete(DeleteBehavior.Restrict);
    }
}