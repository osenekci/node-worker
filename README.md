# Worker Manager
TODO: Documentation!
## config worker.json
- Period is in seconds
- worker and log dir must be absolute
```json
{
  "period": 1,
  "worker_dir": "/path/to/workers",
  "logger": {
    "level": "DEBUG",
    "mode": "CONSOLE",
    "file": "/path/to/log_dir/worker.log"
  },
  "workers": [
    {
      "name": "TestWorker",
      "period": 3600
    },
    {
      "name": "subdir/TestWorker2",
      "period": 3600
    }
  ]
}
```
## Running binary
- workermanager requires a CONFIG_DIR env variable includes worker.json config file
```shell script
CONFIG_DIR='/absolute/path/to/config_dir' workermanager
```
