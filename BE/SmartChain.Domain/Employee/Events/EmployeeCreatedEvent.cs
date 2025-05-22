using System;
using SmartChain.Domain.Common;

namespace SmartChain.Domain.Employee.Events;

public record EmployeeCreatedEvent(Guid EmployeeId, Guid UserId, Guid StoreId) : IDomainEvent;