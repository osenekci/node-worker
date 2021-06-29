const BaseWorker = require('../../lib/BaseWorker');

class TestWorker2 extends BaseWorker {
  async execute() {
    this.log('Worker2');
  }
}

module.exports = TestWorker2;
