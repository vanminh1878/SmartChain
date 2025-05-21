namespace SmartChain.Domain.Common
{
    using System;
    using System.Collections.Generic;
    public abstract class Entity {
        public Guid Id { get; protected set; }
        protected readonly List<IDomainEvent> _domainEvents = new List<IDomainEvent>();
        protected Entity(Guid? id = null) {
            Id = id ?? Guid.NewGuid();
        }
        public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();
        public void AddDomainEvent(IDomainEvent domainEvent) {
            _domainEvents.Add(domainEvent);
        }
        public IReadOnlyCollection<IDomainEvent> PopDomainEvents() {
            var domainEvents = _domainEvents.AsReadOnly();
            _domainEvents.Clear();
            return domainEvents;
        }

        protected Entity() { }
    }
}


