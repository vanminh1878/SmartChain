using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartChain.Domain.Employee;
using SmartChain.Domain.Schedule;

namespace SmartChain.Infrastructure.Persistence.Configurations;

public class ScheduleConfigurations : IEntityTypeConfiguration<Schedule>
{
    public void Configure(EntityTypeBuilder<Schedule> builder)
    {
        // Định nghĩa bảng
        builder.ToTable("Schedule");

        // Khóa chính
        builder.HasKey(s => s.Id);

        // Ánh xạ Id (Guid)
        builder.Property(s => s.Id)
            .HasColumnName("Id")
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("newid()"); // Sinh Guid tự động

        // Thuộc tính EmployeeId (Guid)
        builder.Property(s => s.EmployeeId)
            .IsRequired()
            .HasColumnName("Employee_id")
            .HasColumnType("uniqueidentifier");

        // Thuộc tính StartTime
        builder.Property(s => s.StartTime)
            .IsRequired()
            .HasColumnType("datetime");

        // Thuộc tính EndTime
        builder.Property(s => s.EndTime)
            .IsRequired()
            .HasColumnType("datetime");

        // Thuộc tính CreatedAt
        builder.Property(s => s.CreatedAt)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Created_at");

        // Thuộc tính UpdatedAt
        builder.Property(s => s.UpdatedAt)
            .IsRequired(false) // Nullable
            .HasColumnType("datetime")
            .HasColumnName("Updated_at");

        // Mối quan hệ khóa ngoại với Employee
        builder.HasOne<Employee>()
            .WithMany()
            .HasForeignKey(s => s.EmployeeId)
            .HasConstraintName("FK_Schedule_Employee");
    }
}