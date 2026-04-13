/**
 * DESIGN PATTERN: Strategy Pattern (Abstract Base)
 * SOLID: Open/Closed Principle — open for extension, closed for modification
 * SOLID: Liskov Substitution — all subclasses are substitutable for this base
 * OOP: Abstraction + Inheritance
 */
class BaseReportStrategy {
  /**
   * @param {object} params - Report parameters (userId, dates, etc.)
   * @returns {Promise<object>} - Report result object
   */
  async generate(params) {
    throw new Error(`${this.constructor.name} must implement generate(params)`);
  }

  /**
   * Returns a string identifier for this strategy type.
   * OOP: Polymorphism — each subclass overrides this
   */
  getType() {
    throw new Error(`${this.constructor.name} must implement getType()`);
  }
}

module.exports = BaseReportStrategy;
