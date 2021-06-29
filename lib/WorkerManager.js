const path = require('path');

/**
 * Ticker ticks!
 */
class WorkerManager {
  /**
   * @param {{
   *   workers: Array.<{
   *     name:string,
   *     period:number
   *   }>,
   *   workerDir:string,
   *   workerConfig:Object,
   *   tickPeriod:number
   * }} config
   * @param {Logger} logger
   */
  constructor(config, logger) {
    this._workers = [];
    this._logger = logger;
    this._config = config;
    this._loadWorkers();
    this._interval = null;
    this._runningWorkers = {};
  }

  /**
   * Start workers
   */
  start() {
    this.stop();
    this._interval = setInterval(this._tick, this._config.tickPeriod);
  }

  /**
   * Stop workers
   */
  stop() {
    clearInterval(this._interval);
  }

  /**
   * @private
   */
  _loadWorkers() {
    const workerDir = this._config.workerDir;
    this._workers = [];
    this._config.workers.forEach((worker) => {
      const workerPath = path.join(workerDir, `${worker.name}.js`);
      const Worker = require(workerPath);
      this._workers.push({
        worker: new Worker(this._config.workerConfig, this._logger, worker.name),
        name: worker.name,
        period: worker.period,
        lastCheck: 0,
      });
    });
  }

  /**
   * @return {Array}
   * @private
   */
  _getWorkersToRun() {
    const workersToRun = [];
    this._workers.forEach((worker) => {
      if ((worker.lastCheck + worker.period) > Date.now()) {
        return;
      }
      if (typeof this._runningWorkers[worker.name] === 'undefined') {
        this._runningWorkers[worker.name] = true;
        workersToRun.push(worker);
      }
    });
    return workersToRun;
  }

  /**
   * Ticking!
   */
  _tick = () => {
    const workers = this._getWorkersToRun();
    if (workers.length === 0) {
      return;
    }
    this._logger.debug('-'.repeat(29) + ' Tick Start ' + '-'.repeat(29));
    workers.forEach((worker) => {
      const now = Date.now();
      this._logger.debug(`Executing ${worker.name}`);
      worker.worker.execute()
        .then(() => {
          delete this._runningWorkers[worker.name];
        })
        .catch((e) => {
          this._logger.error(e.message);
          if (e.stack) {
            this._logger.error(e.stack);
          }
          delete this._runningWorkers[worker.name];
        });
      worker.lastCheck = now;
    })
    this._logger.debug('-'.repeat(30) + ' Tick End ' + '-'.repeat(30));
  };
}

module.exports = WorkerManager;
