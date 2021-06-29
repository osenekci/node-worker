/**
 * Base worker
 */
class BaseWorker {
  /**
   * @param {Object} config
   * @param {Logger} logger
   * @param {string} workerName
   */
  constructor(config, logger, workerName) {
    this._config = config;
    this._logger = logger;
    this._workerName = workerName;
  }

  /**
   * @param {*} message
   */
  log(message) {
    const prefix = typeof this._workerName === 'string' ? `worker:${this._workerName} -- ` : '';
    this._logger.info(`${prefix}${message}`);
  }

  /**
   * @return {Object}
   */
  getConfig() {
    return this._config;
  }

  /**
   * @param timeInMs
   * @return {Promise<undefined>}
   */
  async sleep(timeInMs) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeInMs);
    });
  }

  /**
   * Override to define job
   */
  async execute() {

  }
}

module.exports = BaseWorker;
