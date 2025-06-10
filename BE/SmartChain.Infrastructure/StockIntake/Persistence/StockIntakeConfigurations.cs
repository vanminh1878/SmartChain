using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.StockIntake;
using SmartChain.Domain.User;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class StockIntakeConfigurations : IEntityTypeConfiguration<StockIntake>
{
    public void Configure(EntityTypeBuilder<StockIntake> builder)
    {
        builder.ToTable("Stock_Intake");

        builder.HasKey(si => si.Id);

        builder.Property(si => si.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()");

        builder.Property(si => si.Status)
            .IsRequired()
            .HasColumnType("int")
            .HasDefaultValue(0);

        builder.Property(si => si.CreatedBy)
            .IsRequired()
            .HasColumnName("Created_by")
            .HasColumnType("uniqueidentifier");

        builder.Property(si => si.ApprovedBy)
            .IsRequired(false)
            .HasColumnName("Approved_by")
            .HasColumnType("uniqueidentifier");

        builder.Property(si => si.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        builder.Property(si => si.UpdatedAt)
            .IsRequired(false)
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(si => si.CreatedBy)
            .HasConstraintName("FK_StockIntake_CreatedBy_User")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(si => si.ApprovedBy)
            .HasConstraintName("FK_StockIntake_ApprovedBy_User")
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(si => si.StockIntakeDetails)
            .WithOne()
            .HasForeignKey("StockIntakeId")
            .HasConstraintName("FK_StockIntakeDetail_StockIntake")
            .OnDelete(DeleteBehavior.Restrict);
    }
}