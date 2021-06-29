const BaseWorker = require('../../lib/BaseWorker');

class TestWorker1 extends BaseWorker {
  async execute() {
    await this.sleep(4000);
    this.log('Worker1');
  }
}

module.exports = TestWorker1;
