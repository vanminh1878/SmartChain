using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Employee;
using SmartChain.Domain.Store;
using SmartChain.Domain.User;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class EmployeeConfigurations : IEntityTypeConfiguration<Employee>
{
    public void Configure(EntityTypeBuilder<Employee> builder)
    {
        // Định nghĩa bảng
        builder.ToTable("Employee");

        // Khóa chính
        builder.HasKey(e => e.Id);

        // Ánh xạ Id (Guid)
        builder.Property(e => e.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()"); // Sinh Guid tự động

        // Thuộc tính UserId (Guid)
        builder.Property(e => e.UserId)
            .IsRequired()
            .HasColumnName("User_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính StoreId (Guid)
        builder.Property(e => e.StoreId)
            .IsRequired()
            .HasColumnName("Store_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính Status (bool sang tinyint)
        builder.Property(e => e.Status)
            .IsRequired()
            .HasColumnType("tinyint(1)")
            .HasDefaultValue(1); // Mặc định: active

        // Thuộc tính CreatedAt
        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        // Thuộc tính UpdatedAt
        builder.Property(e => e.UpdatedAt)
            .IsRequired(false) // Nullable
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");

        // Mối quan hệ khóa ngoại với User
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .HasConstraintName("FK_Employee_User");

        // Mối quan hệ khóa ngoại với Store
        builder.HasOne<Store>()
            .WithMany()
            .HasForeignKey(e => e.StoreId)
            .HasConstraintName("FK_Employee_Store");
    }
}