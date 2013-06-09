## rij (pronounced "rye")
#### Safe and sensible work queue.

Rij is a redis-backed module for processing and managing background tasks. Each task within Rij is isolated to a process. That process can fail or even throw without the primary "management" process being affected or the job being lost. Failed tasks are logged complete with a stack trace or error information passed by the worker and attempted again by default.

Principles:
- Safety
- Minimalism
- Idempotent operations.

### Installation
```bash
npm install rij
```

### Create A Worker
```javascript
module.exports = function (job, callback) {
    callback(null, job.hello);
};
```

### Enqueue A New Task
```javascript
var rij = require('rij');

rij.enqueue({
    worker: __dirname + '/path/to/worker.js',
    job:    {
        hello: 'world'
    }
}, function (err) {
    // Task has been added to the queue!
});
```

### Start The Queue
```javascript
var rij = require('rij');

// Listen for events
rij.on('complete', function (msg) {
    // A task completed!
});

rij.on('incomplete', function (msg) {
    // Oh no! A task failed (but will be retried).
});

rij.on('fatal', function (err) {
    // Something really bad happened.
});

// Start work queue
rij.work();
```

---

### Methods
**rij.enqueue** - Enqueues a new task.

**rij.status** - Returns the status of the Rij instance.

**rij.work** - Starts workers.


### Events
**complete** - Emitted when a task is completed successfully.

**incomplete** - Emitted when a task fails.

**fatal** - Emitted when a task fails fatally or when a critical issue is detected within Rij.


### Configuration
Rij uses environment variables for configuration. Most notably for Redis connection and concurrency settings:
```bash

```

Individual tasks can also be configured. For example:
```javascript

```