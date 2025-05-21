using MediatR;
using Microsoft.AspNetCore.Http;
using SmartChain.Domain.Common;
using SmartChain.Infrastructure.Common.Persistence;
using Microsoft.Extensions.Logging;

namespace SmartChain.Infrastructure.Common.Middleware;

public class EventualConsistencyMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<EventualConsistencyMiddleware> _logger;

    public const string DomainEventsKey = "DomainEventsKey";

    public EventualConsistencyMiddleware(RequestDelegate next, ILogger<EventualConsistencyMiddleware> logger)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task InvokeAsync(HttpContext context, IPublisher publisher, AppDbContext dbContext)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(publisher);
        ArgumentNullException.ThrowIfNull(dbContext);

        await using var transaction = await dbContext.Database.BeginTransactionAsync();

        context.Response.OnCompleted(async () =>
        {
            try
            {
                if (context.Items.TryGetValue(DomainEventsKey, out var value) && 
                    value is Queue<IDomainEvent> domainEvents)
                {
                    while (domainEvents.TryDequeue(out var domainEvent))
                    {
                        await publisher.Publish(domainEvent);
                    }
                }

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing domain events or committing transaction.");
                throw; // Re-throw để báo lỗi, không bỏ qua ngoại lệ
            }
        });

        await _next(context);
    }
}