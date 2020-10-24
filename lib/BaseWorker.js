/**
 * Base worker
 */
class BaseWorker {
  /**
   * @param {Config} config
   * @param {Logger} logger
   */
  constructor(config, logger) {
    this.config = config;
    this._logger = logger;
  }

  /**
   * @param {*} message
   */
  log(message) {
    this._logger.info(message);
  }

  /**
   * Override to define job
   */
  async execute() {

  }
}

module.exports = BaseWorker;
