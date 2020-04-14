const path = require('path');

/**
 * Ticker ticks!
 */
class WorkerManager {
  /**
   * @typedef {{
   *   name:string,
   *   period:number
   * }} Worker
   */

  /**
   * @param {Array.<Worker>} workers
   * @param {Logger} logger
   * @param {Config} config
   */
  constructor(workers, logger, config) {
    this._workers = [];
    this._logger = logger;
    this._config = config;
    this._loadWorkers(workers);
    this._terminated = false;
  }

  /**
   * @param {Array.<Worker>} workers
   * @private
   */
  _loadWorkers(workers) {
    const workerDir = this._config.get('worker.worker_dir');
    this._workers = [];
    workers.forEach((worker) => {
      const workerPath = path.join(workerDir, `${worker.name}.js`);
      const Worker = require(workerPath);
      this._workers.push({
        worker: new Worker(this._config, this._logger),
        name: worker.name,
        period: worker.period * 1000,
        lastCheck: 0,
      });
    });
  }

  /**
   * Check if a worker is ready or not
   * @return {boolean}
   * @private
   */
  _workersReady() {
    let ready = false;
    this._workers.forEach((worker) => {
      if ((worker.lastCheck + worker.period) > Date.now()) {
        return;
      }
      ready = true;
    });
    return ready;
  }

  async terminate() {
    this._terminated = true;
  }

  /**
   * Ticking!
   */
  async tick() {
    if (!this._workersReady()) {
      return;
    }
    this._logger.debug('-'.repeat(29) + ' Tick Start ' + '-'.repeat(29));
    for (let i = 0; i < this._workers.length; i++) {
      if (this._terminated) {
        break;
      }
      const worker = this._workers[i];
      const now = Date.now();
      if ((worker.lastCheck + worker.period) > now) {
        return;
      }
      this._logger.info('-'.repeat(10) +
          ` Executing ${worker.name} ` + '-'.repeat(10));
      try {
        await worker.worker.execute();
      } catch (e) {
        this._logger.error(e.message);
        this._logger.error(e.stack);
      }
      worker.lastCheck = now;
    }
    this._logger.debug('-'.repeat(30) + ' Tick End ' + '-'.repeat(30));
  }
}

module.exports = WorkerManager;
