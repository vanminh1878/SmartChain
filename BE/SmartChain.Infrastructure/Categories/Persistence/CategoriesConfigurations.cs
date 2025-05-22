using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Categories;
using SmartChain.Domain.Store;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class CategoryConfigurations : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        // Định nghĩa bảng
        builder.ToTable("Category");

        // Khóa chính
        builder.HasKey(c => c.Id);

        // Ánh xạ Id (Guid)
        builder.Property(c => c.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()"); // Sinh Guid tự động

        // Thuộc tính Name
        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(50)
            .HasColumnType("varchar(50)");

        // Thuộc tính StoreId (Guid)
        builder.Property(c => c.StoreId)
            .IsRequired()
            .HasColumnName("Store_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính Status (bool sang tinyint)
        builder.Property(c => c.Status)
            .IsRequired()
            .HasColumnType("tinyint(1)")
            .HasDefaultValue(1); // Mặc định: active

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
            .HasConstraintName("FK_Category_Store");
    }
}