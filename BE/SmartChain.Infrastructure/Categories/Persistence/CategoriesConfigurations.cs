using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Categories;
//using SmartChain.Domain.Products; // Giả định namespace của Product

namespace SmartChain.Infrastructure.Categories.Persistence;

public class CategoryConfigurations : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        // Định nghĩa khóa chính
        builder.HasKey(c => c.Id);

        // Cấu hình Id không tự động sinh
        builder.Property(c => c.Id)
            .ValueGeneratedNever();

        // Cấu hình thuộc tính Name
        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(255); // Giới hạn độ dài chuỗi

        // Cấu hình thuộc tính StoreId
        builder.Property(c => c.StoreId)
            .IsRequired();

        // Cấu hình thuộc tính Status
        builder.Property(c => c.Status)
            .IsRequired();

        // Cấu hình thuộc tính CreatedAt
        builder.Property(c => c.CreatedAt)
            .IsRequired();

        // Cấu hình thuộc tính UpdatedAt
        builder.Property(c => c.UpdatedAt);

        // // Định nghĩa quan hệ một-nhiều với Product
        // builder.HasMany<Product>() // Giả định Product là entity
        //     .WithOne(p => p.Category) // Navigation property từ Product về Category
        //     .HasForeignKey(p => p.CategoryId) // Khóa ngoại trong Product
        //     .OnDelete(DeleteBehavior.Cascade); // Xóa Category sẽ xóa các Product liên quan (tùy chọn)
    }
}