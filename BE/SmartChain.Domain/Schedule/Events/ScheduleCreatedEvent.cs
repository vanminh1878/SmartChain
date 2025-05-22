using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Schedule.Events;

public record ScheduleCreatedEvent(Guid ScheduleId, Guid EmployeeId, DateTime StartTime, DateTime EndTime) : IDomainEvent;