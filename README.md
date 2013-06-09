## rij (pronounced "rye")
#### Safe and sensible work queue.

Rij is a Redis-backed Node.js module for reliabily processing and monitoring background tasks. Unlike [Resque](https://github.com/resque/resque), [DelayedJob](https://github.com/tobi/delayed_job), or [Beanstalkd](http://kr.github.io/beanstalkd/) – each task within Rij is isolated to a process. That process can fail or even throw without the primary "management" process being affected or the job being lost. Failed tasks are provided back to the master process complete with a stack trace and attempted again by default.

**Principles:** Safety, Minimalism, Idempotence

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
rij.start();
```

---

### Methods
**rij.enqueue** - Enqueues a new task.

**rij.status** - Returns the status of the Rij instance.

**rij.start** - Starts workers.


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

---

### Differences to Resque
Before building Rij, [DIY](https://diy.org) went through a number of background task systems including SQS, Beanstalkd and Resque. The differences between these three are fairly vast, but Rij is most similar to Resque most notability in the way in which both are backed by Redis and even more specifically Redis' [list data type](http://redis.io/topics/data-types). From a feature standpoint both Resque and Rij provide: persistence, speed, distributed workers, and simple configuration. This really is where the similarities end however as Rij could be described as a rethink of Resque in both scope and approach within the Node.js ecosystem.

Resque is rather broad in it's scope. It provides *many* features which Rij does not including: tags, priorities, multiple queues, and even an entire Sinatra-based web app for monitoring, editing and managing queues. Rather Rij designed to be an incredibly light layer that sits in-between Redis and Node.js's [cluster](http://nodejs.org/api/cluster.html) API that simply helps the user enqueue tasks, process them and provide feedback on status. Task editing and management interfaces are left up to [user-land](https://npmjs.org).