using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Store;
using SmartChain.Domain.Supplier;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class SupplierConfigurations : IEntityTypeConfiguration<Supplier>
{
   public void Configure(EntityTypeBuilder<Supplier> builder)
    {
        builder.ToTable("Supplier");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()");

        builder.Property(s => s.Name)
            .IsRequired()
            .HasMaxLength(100)
            .HasColumnType("varchar(100)");

        builder.Property(s => s.Contact_name)
            .IsRequired()
            .HasMaxLength(50)
            .HasColumnType("varchar(50)");

        builder.Property(s => s.PhoneNumber)
            .IsRequired()
            .HasMaxLength(20)
            .HasColumnType("varchar(20)");

        builder.Property(s => s.Email)
            .IsRequired()
            .HasMaxLength(150)
            .HasColumnType("varchar(150)");

        builder.Property(s => s.Address)
            .IsRequired()
            .HasMaxLength(255)
            .HasColumnType("varchar(255)");

        builder.Property(s => s.Status)
            .HasColumnType("bit")
            .HasDefaultValue(true);

        builder.Property(s => s.Latitude)
            .IsRequired(false)
            .HasColumnType("decimal(9,6)");

        builder.Property(s => s.Longitude)
            .IsRequired(false)
            .HasColumnType("decimal(9,6)");

        builder.Property(s => s.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        builder.Property(s => s.UpdatedAt)
            .IsRequired(false)
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");
    }
}