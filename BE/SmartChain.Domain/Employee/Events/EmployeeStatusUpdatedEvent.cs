using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Employee.Events;

public record EmployeeStatusUpdatedEvent(Guid EmployeeId, bool Status) : IDomainEvent;