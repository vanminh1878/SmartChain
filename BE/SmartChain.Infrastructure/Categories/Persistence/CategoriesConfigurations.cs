using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Categories;

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
            .HasColumnType("nvarchar(50)");

        builder.Property(c => c.Status)
            .IsRequired()
            .HasColumnType("bit")
            .HasDefaultValue(true);

        builder.Property(c => c.Image)
            .IsRequired(false)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)");

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