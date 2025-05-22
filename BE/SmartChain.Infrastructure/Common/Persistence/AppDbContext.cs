using System.Runtime.CompilerServices;
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

namespace SmartChain.Infrastructure.Common.Persistence;

public class AppDbContext : DbContext
{
    private readonly IHttpContextAccessor? _httpContextAccessor;
    private readonly IPublisher? _publisher;

    public AppDbContext(DbContextOptions<AppDbContext> options, IHttpContextAccessor? httpContextAccessor = null, IPublisher? publisher = null) 
        : base(options)
    {
        _httpContextAccessor = httpContextAccessor;
        _publisher = publisher;
    }

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

    private async Task PublishDomainEvents(List<IDomainEvent> domainEvents)
    {
        if (_publisher == null) return;
        foreach (var domainEvent in domainEvents)
        {
            await _publisher.Publish(domainEvent);
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    private bool IsUserWaitingOnline() => _httpContextAccessor?.HttpContext is not null;

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var domainEvents = ChangeTracker.Entries<Entity>()
            .SelectMany(entry => entry.Entity.PopDomainEvents())
            .ToList();

        if (IsUserWaitingOnline())
        {
            AddDomainEventsToOfflineProcessingQueue(domainEvents);
            return await base.SaveChangesAsync(cancellationToken);
        }

        await PublishDomainEvents(domainEvents);
        return await base.SaveChangesAsync(cancellationToken);
    }

    private void AddDomainEventsToOfflineProcessingQueue(List<IDomainEvent> domainEvents)
    {
        if (_httpContextAccessor?.HttpContext == null) return;
        Queue<IDomainEvent> domainEventsQueue = _httpContextAccessor.HttpContext.Items.TryGetValue(EventualConsistencyMiddleware.DomainEventsKey, out var value) &&
            value is Queue<IDomainEvent> existingDomainEvents
                ? existingDomainEvents
                : new();

        domainEvents.ForEach(domainEventsQueue.Enqueue);
        _httpContextAccessor.HttpContext.Items[EventualConsistencyMiddleware.DomainEventsKey] = domainEventsQueue;
    }
}