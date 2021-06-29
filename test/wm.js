const Logger = require('node-logger-lc');
const WorkerManager = require('../lib/WorkerManager');

const logger = new Logger({
  level: 'INFO',
  mode: 'CONSOLE',
  file: '',
});

const manager = new WorkerManager({
  workers: [
    {
      name: 'TestWorker1',
      period: 2000,
    },
    {
      name: 'TestWorker2',
      period: 5000,
    }
  ],
  workerDir: `${__dirname}/workers`,
  workerConfig: {},
  tickPeriod: 1000,
}, logger);

manager.start();
