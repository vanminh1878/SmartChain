using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Schedule.Events;

public record ScheduleDeletedEvent(Guid ScheduleId, Guid EmployeeId) : IDomainEvent;