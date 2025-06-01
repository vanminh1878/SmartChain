using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Employee.Events;

public record EmployeeUpdatedEvent(Guid EmployeeId, Guid storeId) : IDomainEvent;