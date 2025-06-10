using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Categories;
using SmartChain.Domain.Product;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class ProductConfigurations : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Product");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()");

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)");

        builder.Property(p => p.Description)
            .HasColumnType("text");

        builder.Property(p => p.Price)
            .IsRequired()
            .HasColumnType("decimal(10,2)");

        builder.Property(p => p.StockQuantity)
            .IsRequired()
            .HasColumnType("int");

        builder.Property(p => p.Image)
            .IsRequired(false)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)");

        builder.Property(p => p.CategoryId)
            .IsRequired()
            .HasColumnName("Category_id")
            .HasColumnType("uniqueidentifier");

        builder.Property(p => p.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        builder.Property(p => p.UpdatedAt)
            .IsRequired(false)
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");

        builder.HasOne<Category>()
            .WithMany()
            .HasForeignKey(p => p.CategoryId)
            .HasConstraintName("FK_Product_Category")
            .OnDelete(DeleteBehavior.Restrict);
    }
}