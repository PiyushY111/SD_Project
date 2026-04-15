const { EventEmitter } = require('events');

/**
 * DESIGN PATTERN: Observer Pattern
 * Uses Node.js built-in EventEmitter as the subject.
 * Any module can subscribe (observe) transaction lifecycle events
 * without the TransactionController needing to know about them.
 *
 * SOLID: Open/Closed — new observers can be added without modifying the emitter
 * SOLID: Dependency Inversion — consumers depend on this abstraction, not concrete logic
 */
class TransactionEventEmitter extends EventEmitter {
  // Singleton instance so all modules share the same event bus
  static #instance = null;

  constructor() {
    super();
  }

  static getInstance() {
    if (!TransactionEventEmitter.#instance) {
      TransactionEventEmitter.#instance = new TransactionEventEmitter();
    }
    return TransactionEventEmitter.#instance;
  }

  emitCreated(transaction) {
    this.emit('transaction:created', transaction);
  }

  emitUpdated(transaction) {
    this.emit('transaction:updated', transaction);
  }

  emitDeleted(transactionId) {
    this.emit('transaction:deleted', { transactionId });
  }
}

module.exports = TransactionEventEmitter;
