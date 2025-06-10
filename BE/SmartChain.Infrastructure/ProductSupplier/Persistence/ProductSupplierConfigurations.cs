using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.ProductSupplier;
using SmartChain.Domain.Product;
using SmartChain.Domain.Supplier;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class ProductSupplierConfigurations : IEntityTypeConfiguration<ProductSupplier>
{
    public void Configure(EntityTypeBuilder<ProductSupplier> builder)
    {
        builder.ToTable("Product_Supplier");

        builder.HasKey(ps => new { ps.ProductId, ps.SupplierId });

        builder.Property(ps => ps.ProductId)
            .HasColumnName("Product_id")
            .HasColumnType("uniqueidentifier");

        builder.Property(ps => ps.SupplierId)
            .HasColumnName("Supplier_id")
            .HasColumnType("uniqueidentifier");

        builder.HasOne<Product>()
            .WithMany()
            .HasForeignKey(ps => ps.ProductId)
            .HasConstraintName("FK_ProductSupplier_Product")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Supplier>()
            .WithMany()
            .HasForeignKey(ps => ps.SupplierId)
            .HasConstraintName("FK_ProductSupplier_Supplier")
            .OnDelete(DeleteBehavior.Cascade);
    }
}