using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.StockIntake;
using SmartChain.Domain.Product;
using SmartChain.Domain.Store;
using SmartChain.Domain.Supplier;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class StockIntakeDetailConfigurations : IEntityTypeConfiguration<StockIntakeDetail>
{
    public void Configure(EntityTypeBuilder<StockIntakeDetail> builder)
    {
        builder.ToTable("Stock_Intake_Detail");

        builder.HasKey(sid => sid.Id);

        builder.Property(sid => sid.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()");

        builder.Property(sid => sid.StockIntakeId)
            .IsRequired()
            .HasColumnName("StockIntakeId")
            .HasColumnType("uniqueidentifier");

        builder.Property(sid => sid.ProductId)
            .IsRequired()
            .HasColumnName("Product_id")
            .HasColumnType("uniqueidentifier");

        builder.Property(sid => sid.StoreId)
            .IsRequired()
            .HasColumnName("Store_id")
            .HasColumnType("uniqueidentifier");

        builder.Property(sid => sid.SupplierId)
            .IsRequired()
            .HasColumnName("Supplier_id")
            .HasColumnType("uniqueidentifier");

        builder.Property(sid => sid.Profit_margin)
            .IsRequired()
            .HasColumnName("Profit_margin")
            .HasColumnType("decimal(5,2)")
            .HasDefaultValue(0.30m);

        builder.Property(sid => sid.Quantity)
            .IsRequired()
            .HasColumnType("int");

        builder.Property(sid => sid.UnitPrice)
            .IsRequired()
            .HasColumnName("Unit_price")
            .HasColumnType("decimal(10,2)");

        builder.Property(sid => sid.IntakeDate)
            .IsRequired()
            .HasColumnType("datetime");

        builder.Property(sid => sid.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        builder.Property(sid => sid.UpdatedAt)
            .IsRequired(false)
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");

        builder.HasOne<StockIntake>()
            .WithMany(si => si.StockIntakeDetails)
            .HasForeignKey(sid => sid.StockIntakeId)
            .HasConstraintName("FK_StockIntakeDetail_StockIntake")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<Product>()
            .WithMany()
            .HasForeignKey(sid => sid.ProductId)
            .HasConstraintName("FK_StockIntakeDetail_Product")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<Store>()
            .WithMany()
            .HasForeignKey(sid => sid.StoreId)
            .HasConstraintName("FK_StockIntakeDetail_Store")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<Supplier>()
            .WithMany()
            .HasForeignKey(sid => sid.SupplierId)
            .HasConstraintName("FK_StockIntakeDetail_Supplier")
            .OnDelete(DeleteBehavior.Restrict);
    }
}