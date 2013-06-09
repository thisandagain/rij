## rij (pronounced "rye")
#### Safe and sensible work queue.

Compare to beanstalkd and resque... explain difference in detail. 

Each task is isolated to a single process. That process can fail without the main worker "management" process being affected or the job being lost. Failed tasks are logged complete with a stack trace or error information passed by the worker and attempted again by default.

Resque has a few different implementations (most notability one mature implementation in the Ruby community and one for Node.js that is much less mature that was written in coffeescript.) While resqueue (like Rij) is Redis-backed, resqueue lacks many features that make it "safe" such as process watchdogs, task idempotence and "burying" (ie: retrying) of failed tasks. This makes it less than ideal for production deployments where failure post mortems and job success are imperatives.

Beanstalkd is designed for speed, but – unlike Resque – is a "proper" work queue in that is includes some safety features such as "burying" a job. That said, due to it's platform agnostic nature and feature focus being centered around speed, it trades much in terms of debuggability and safety for that goal.

Principles:
- Safety over speed. 
- Simplicity over features.
- Jobs should be idempotent.

### Installation
```bash
npm install rij
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

```javascript
module.exports = function (job, callback) {
    callback(null, job.hello);
};
```

### Starting Workers
```javascript
var rij = require('rij');

// Start work queue
rij.work();

// Event emitters
rij.on('complete', function (msg) {
    
});

rij.on('incomplete', function (msg) {
    
});

rij.on('fatal', function (err) {
    
});
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