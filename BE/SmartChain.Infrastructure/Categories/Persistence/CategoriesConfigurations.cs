using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Categories;
using SmartChain.Domain.Store;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class CategoryConfigurations : IEntityTypeConfiguration<Category>
{
public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Category");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()");

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(50)
            .HasColumnType("varchar(50)");

        builder.Property(c => c.Status)
            .IsRequired()
            .HasColumnType("bit")
            .HasDefaultValue(true);

        builder.Property(c => c.Profit_margin)
            .IsRequired()
            .HasColumnName("Profit_margin")
            .HasColumnType("decimal(5,2)")
            .HasDefaultValue(0.30m);

        builder.Property(c => c.Image)
            .IsRequired(false)
            .HasMaxLength(500)
            .HasColumnType("varchar(500)");

        builder.Property(c => c.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        builder.Property(c => c.UpdatedAt)
            .IsRequired(false)
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");
    }
}