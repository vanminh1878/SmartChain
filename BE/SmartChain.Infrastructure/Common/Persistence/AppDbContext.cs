using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SmartChain.Domain.Account;
using SmartChain.Domain.Cart;
using SmartChain.Domain.Categories;
using SmartChain.Domain.Common;
using SmartChain.Domain.Customer;
using SmartChain.Domain.Employee;
using SmartChain.Domain.Order;
using SmartChain.Domain.Product;
using SmartChain.Domain.Report;
using SmartChain.Domain.Role;
using SmartChain.Domain.Schedule;
using SmartChain.Domain.StockIntake;
using SmartChain.Domain.Store;
using SmartChain.Domain.Supplier;
using SmartChain.Domain.User;
using SmartChain.Infrastructure.Common.Middleware;

namespace SmartChain.Infrastructure.Common.Persistence
{
    public class AppDbContext : DbContext
    {
        private readonly IHttpContextAccessor? _httpContextAccessor;
        private readonly IPublisher? _publisher;

        // Constructor dùng cho runtime với DI (Dependency Injection)
        public AppDbContext(
            DbContextOptions<AppDbContext> options,
            IHttpContextAccessor? httpContextAccessor = null,
            IPublisher? publisher = null)
            : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
            _publisher = publisher;
        }

        // Constructor dùng cho design-time (EF Core migrations)
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // DbSet cho các entity
        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Account> Accounts { get; set; } = null!;
        public DbSet<Store> Stores { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Employee> Employees { get; set; } = null!;
        public DbSet<Schedule> Schedules { get; set; } = null!;
        public DbSet<Supplier> Suppliers { get; set; } = null!;
        public DbSet<Customer> Customers { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<StockIntake> StockIntakes { get; set; } = null!;
        public DbSet<StockIntakeDetail> StockIntakeDetails { get; set; } = null!;
        public DbSet<Cart> Carts { get; set; } = null!;
        public DbSet<CartDetail> CartDetails { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderDetail> OrderDetails { get; set; } = null!;
        public DbSet<Report> Reports { get; set; } = null!;

        // Áp dụng cấu hình entity từ các file configuration trong assembly
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
            base.OnModelCreating(modelBuilder);
        }

        // Kiểm tra xem có đang xử lý request HTTP không
        private bool IsUserWaitingOnline() => _httpContextAccessor?.HttpContext is not null;

        // Ghi đè SaveChangesAsync để xử lý domain events
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // Lấy danh sách domain events từ các entity
            var domainEvents = ChangeTracker.Entries<Entity>()
                .SelectMany(entry => entry.Entity.PopDomainEvents())
                .ToList();

            if (IsUserWaitingOnline())
            {
                // Thêm domain events vào queue để xử lý offline nếu đang trong HTTP context
                AddDomainEventsToOfflineProcessingQueue(domainEvents);
            }
            else
            {
                // Publish domain events trực tiếp nếu không trong HTTP context
                await PublishDomainEvents(domainEvents);
            }

            // Lưu thay đổi vào database
            return await base.SaveChangesAsync(cancellationToken);
        }

        // Publish domain events thông qua MediatR
        private async Task PublishDomainEvents(List<IDomainEvent> domainEvents)
        {
            if (_publisher == null) return;

            foreach (var domainEvent in domainEvents)
            {
                await _publisher.Publish(domainEvent, cancellationToken: default);
            }
        }

        // Thêm domain events vào queue để xử lý eventual consistency
        private void AddDomainEventsToOfflineProcessingQueue(List<IDomainEvent> domainEvents)
        {
            if (_httpContextAccessor?.HttpContext == null) return;

            // Lấy hoặc tạo queue domain events từ HttpContext
            if (!_httpContextAccessor.HttpContext.Items.TryGetValue(EventualConsistencyMiddleware.DomainEventsKey, out var value) ||
                value is not Queue<IDomainEvent> domainEventsQueue)
            {
                domainEventsQueue = new Queue<IDomainEvent>();
            }

            // Thêm các domain events vào queue
            foreach (var domainEvent in domainEvents)
            {
                domainEventsQueue.Enqueue(domainEvent);
            }

            // Lưu queue vào HttpContext
            _httpContextAccessor.HttpContext.Items[EventualConsistencyMiddleware.DomainEventsKey] = domainEventsQueue;
        }
    }
}