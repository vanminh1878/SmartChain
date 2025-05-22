using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Product;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class StockIntakeDetailConfigurations : IEntityTypeConfiguration<StockIntakeDetail>
{
    public void Configure(EntityTypeBuilder<StockIntakeDetail> builder)
    {
        // Định nghĩa bảng
        builder.ToTable("Stock_Intake_Detail");

        // Khóa chính
        builder.HasKey(sid => sid.Id);

        // Ánh xạ Id (Guid)
        builder.Property(sid => sid.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()"); // Sinh Guid tự động

        // Thuộc tính ProductId (Guid)
        builder.Property(sid => sid.ProductId)
            .IsRequired()
            .HasColumnName("Product_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính Quantity
        builder.Property(sid => sid.Quantity)
            .IsRequired()
            .HasColumnType("int");

        // Thuộc tính UnitPrice
        builder.Property(sid => sid.UnitPrice)
            .IsRequired()
            .HasColumnType("decimal(10,2)");

        // Thuộc tính CreatedAt
        builder.Property(sid => sid.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        // Thuộc tính UpdatedAt
        builder.Property(sid => sid.UpdatedAt)
            .IsRequired(false) // Nullable
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");

        // Mối quan hệ khóa ngoại với Product
        builder.HasOne<Product>()
            .WithMany()
            .HasForeignKey(sid => sid.ProductId)
            .HasConstraintName("FK_StockIntakeDetail_Product");

        // Mối quan hệ khóa ngoại với StockIntake
        builder.HasOne<StockIntake>()
            .WithMany(si => si.StockIntakeDetails)
            .HasForeignKey("StockIntakeId") // Giả sử StockIntakeDetail có thuộc tính StockIntakeId
            .HasConstraintName("FK_StockIntakeDetail_StockIntake")
            .OnDelete(DeleteBehavior.Cascade); // Xóa StockIntake thì xóa luôn StockIntakeDetail
    }
}