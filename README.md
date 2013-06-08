## rij (pronounced "rye")
#### A safe and sensible work queue.

Compare to beanstalkd and resque... explain difference in detail. 

Each task is isolated to a single process. That process can fail without the main worker "management" process being affected or the job being lost. Failed tasks are logged complete with a stack trace or error information passed by the worker and attempted again by default.

Resque has a few different implementations (most notability one mature implementation in the Ruby community and one for Node.js that is much less mature that was written in coffeescript.) While resqueue (like Rij) is Redis-backed, resqueue lacks many features that make it "safe" such as process watchdogs, task idempotence and "burying" (ie: retrying) of failed tasks. This makes it less than ideal for production deployments where failure post mortems and job success are imperatives.

Beanstalkd is designed for speed, but is a "proper" work queue in that is includes some safety features such as "burying" a job. That said, due to it's platform agnostic nature and feature focus being centered around speed, it trades much in terms of debuggability and safety for that goal.

Principles:
- Safety over speed. 
- Simplicity over features.
- Jobs should be idempotent.

### Task Options
```javascript
{
    retry: 5,
    timeout: 2000,  // specified in ms
}
```

### Getting Started
```javascript
var rij     = require('rij');

rij.queue('helloworld', function (payload, callback) {
    
});

rij.enqueue({
    
}, function (err) {
    
});

rij.status(function (callback) {
    
});

// Event emitters
rij.on('complete', function (data) {
    
});

rij.on('error', function (data) {
    
});

rij.on('fatal', function (data) {
    
});
```

---

### Methods

### Events

### Configuration

---

### Utilities
Rij has an HTTP server compainion utility that make working with Rij easier:

`oden` - An HTTP server front-end for Rij.

### Who Uses It?
Rij is currently deployed at [DIY](https://diy.org) and can handle well over 500,000 tasks per day for us. Using Rij? [Let us know about it!](mailto:andrew@diy.org)
