using System.Runtime.CompilerServices;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SmartChain.Domain.Categories;
using SmartChain.Domain.Common;
using SmartChain.Infrastructure.Common.Middleware;

namespace SmartChain.Infrastructure.Common.Persistence;

public class AppDbContext : DbContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IPublisher _publisher;

    public AppDbContext(DbContextOptions options, IHttpContextAccessor httpContextAccessor, IPublisher publisher) : base(options)
    {
        _httpContextAccessor = httpContextAccessor;
        _publisher = publisher;

    }
    public DbSet<Category> Categories { get; set; } = null!;
    private async Task PublishDomainEvents(List<IDomainEvent> domainEvents)
    {
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
    private bool IsUserWaitingOnline() => _httpContextAccessor.HttpContext is not null;
    public async override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
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
        Queue<IDomainEvent> domainEventsQueue = _httpContextAccessor.HttpContext!.Items.TryGetValue(EventualConsistencyMiddleware.DomainEventsKey, out var value) &&
            value is Queue<IDomainEvent> existingDomainEvents
                ? existingDomainEvents
                : new();

        domainEvents.ForEach(domainEventsQueue.Enqueue);
        _httpContextAccessor.HttpContext.Items[EventualConsistencyMiddleware.DomainEventsKey] = domainEventsQueue;
    }
    
}

