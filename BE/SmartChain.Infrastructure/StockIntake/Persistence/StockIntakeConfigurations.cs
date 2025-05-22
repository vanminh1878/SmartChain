using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.StockIntake;
using SmartChain.Domain.Store;
using SmartChain.Domain.Supplier;
using SmartChain.Domain.User;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class StockIntakeConfigurations : IEntityTypeConfiguration<StockIntake>
{
    public void Configure(EntityTypeBuilder<StockIntake> builder)
    {
        // Định nghĩa bảng
        builder.ToTable("Stock_Intake");

        // Khóa chính
        builder.HasKey(si => si.Id);

        // Ánh xạ Id (Guid)
        builder.Property(si => si.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()"); // Sinh Guid tự động

        // Thuộc tính SupplierId (Guid)
        builder.Property(si => si.SupplierId)
            .IsRequired()
            .HasColumnName("Supplier_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính StoreId (Guid)
        builder.Property(si => si.StoreId)
            .IsRequired()
            .HasColumnName("Store_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính IntakeDate
        builder.Property(si => si.IntakeDate)
            .IsRequired()
            .HasColumnType("datetime");

        // Thuộc tính Status
        builder.Property(si => si.Status)
            .IsRequired()
            .HasColumnType("int")
            .HasDefaultValue(0); // Mặc định: pending

        // Thuộc tính CreatedBy (Guid)
        builder.Property(si => si.CreatedBy)
            .IsRequired()
            .HasColumnName("Created_by")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính ApprovedBy (Guid, nullable)
        builder.Property(si => si.ApprovedBy)
            .IsRequired(false)
            .HasColumnName("Approved_by")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính CreatedAt
        builder.Property(si => si.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        // Thuộc tính UpdatedAt
        builder.Property(si => si.UpdatedAt)
            .IsRequired(false) // Nullable
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");

        // Mối quan hệ khóa ngoại với Supplier
        builder.HasOne<Supplier>()
            .WithMany()
            .HasForeignKey(si => si.SupplierId)
            .HasConstraintName("FK_StockIntake_Supplier")
            .OnDelete(DeleteBehavior.Restrict);

        // Mối quan hệ khóa ngoại với Store
        builder.HasOne<Store>()
            .WithMany()
            .HasForeignKey(si => si.StoreId)
            .HasConstraintName("FK_StockIntake_Store")
            .OnDelete(DeleteBehavior.Restrict);

        // Mối quan hệ khóa ngoại với User (CreatedBy)
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(si => si.CreatedBy)
            .HasConstraintName("FK_StockIntake_CreatedBy_User")
            .OnDelete(DeleteBehavior.Restrict);

        // Mối quan hệ khóa ngoại với User (ApprovedBy)
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(si => si.ApprovedBy)
            .HasConstraintName("FK_StockIntake_ApprovedBy_User")
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);

        // Mối quan hệ một-nhiều với StockIntakeDetail
        builder.HasMany(si => si.StockIntakeDetails)
            .WithOne()
            .HasForeignKey("StockIntakeId") // Giả sử StockIntakeDetail có thuộc tính StockIntakeId
            .HasConstraintName("FK_StockIntakeDetail_StockIntake")
            .OnDelete(DeleteBehavior.Restrict);
    }
}