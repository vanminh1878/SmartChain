using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Report;
using SmartChain.Domain.Store;
using SmartChain.Domain.User;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class ReportConfigurations : IEntityTypeConfiguration<Report>
{
    public void Configure(EntityTypeBuilder<Report> builder)
    {
        // Định nghĩa bảng
        builder.ToTable("Report");

        // Khóa chính
        builder.HasKey(r => r.Id);

        // Ánh xạ Id (Guid)
        builder.Property(r => r.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()"); // Sinh Guid tự động

        // Thuộc tính StoreId (Guid)
        builder.Property(r => r.StoreId)
            .IsRequired()
            .HasColumnName("Store_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính ReportType
        builder.Property(r => r.ReportType)
            .IsRequired()
            .HasMaxLength(50)
            .HasColumnType("varchar(50)");

        // Thuộc tính StartDate
        builder.Property(r => r.StartDate)
            .IsRequired()
            .HasColumnType("datetime");

        // Thuộc tính EndDate
        builder.Property(r => r.EndDate)
            .IsRequired()
            .HasColumnType("datetime");

        // Thuộc tính GeneratedBy (Guid)
        builder.Property(r => r.GeneratedBy)
            .IsRequired()
            .HasColumnName("Generated_by")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính FilePath
        builder.Property(r => r.FilePath)
            .IsRequired()
            .HasMaxLength(500)
            .HasColumnType("varchar(500)");

        // Thuộc tính CreatedAt
        builder.Property(r => r.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        // Mối quan hệ khóa ngoại với Store
        builder.HasOne<Store>()
            .WithMany()
            .HasForeignKey(r => r.StoreId)
            .HasConstraintName("FK_Report_Store");

        // Mối quan hệ khóa ngoại với User (GeneratedBy)
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(r => r.GeneratedBy)
            .HasConstraintName("FK_Report_User");
    }
}