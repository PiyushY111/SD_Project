const TransactionEventEmitter = require('./TransactionEventEmitter');

/**
 * DESIGN PATTERN: Observer Pattern (Concrete Observer)
 * Subscribes to transaction lifecycle events and logs them.
 * Completely decoupled from the TransactionController.
 *
 * SOLID: Single Responsibility — only responsible for logging transaction events
 * SOLID: Open/Closed — add new observers without touching existing code
 */
class TransactionLogger {
  constructor() {
    const emitter = TransactionEventEmitter.getInstance();

    emitter.on('transaction:created', (transaction) => {
      console.log(`[TransactionLogger] Created — ID: ${transaction._id}, Amount: ${transaction.amount}, Type: ${transaction.type}`);
    });

    emitter.on('transaction:updated', (transaction) => {
      console.log(`[TransactionLogger] Updated — ID: ${transaction._id}`);
    });

    emitter.on('transaction:deleted', ({ transactionId }) => {
      console.log(`[TransactionLogger] Deleted — ID: ${transactionId}`);
    });
  }
}

module.exports = TransactionLogger;
