using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Report.Events;

public record ReportCreatedEvent(Guid ReportId, Guid StoreId, string ReportType, Guid GeneratedBy) : IDomainEvent;