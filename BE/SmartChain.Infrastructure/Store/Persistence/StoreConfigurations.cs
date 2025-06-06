using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Store;
using SmartChain.Domain.User;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class StoreConfigurations : IEntityTypeConfiguration<Store>
{
    public void Configure(EntityTypeBuilder<Store> builder)
    {
        builder.ToTable("Store");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()");

        builder.Property(s => s.Name)
            .IsRequired()
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)");

        builder.Property(s => s.Address)
            .IsRequired()
            .HasMaxLength(255)
            .HasColumnType("nvarchar(255)");

        builder.Property(s => s.PhoneNumber)
            .IsRequired()
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)");

        builder.Property(s => s.Email)
            .IsRequired()
            .HasMaxLength(150)
            .HasColumnType("nvarchar(150)");

        builder.Property(s => s.Status)
            .HasColumnType("bit")
            .HasDefaultValue(true);

        builder.Property(s => s.Latitude)
            .IsRequired(false)
            .HasColumnType("decimal(9,6)");

        builder.Property(s => s.Longitude)
            .IsRequired(false)
            .HasColumnType("decimal(9,6)");

        builder.Property(s => s.Image)
            .IsRequired(false)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)");

        builder.Property(s => s.OwnerId)
            .HasColumnName("Owner_id")
            .HasColumnType("uniqueidentifier");

        builder.Property(s => s.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        builder.Property(s => s.UpdatedAt)
            .IsRequired(false)
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(s => s.OwnerId)
            .HasConstraintName("FK_Store_User");
    }
}