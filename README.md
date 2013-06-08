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

### Installation
```bash
npm install rij
```

### Enqueue A New Task
```javascript
var rij = require('rij');

rij.enqueue({
    
}, function (err) {
    
});
```

```javascript
module.exports = function (job, callback) {
    callback(null, 'hello world');
};
```

### Starting Workers
```javascript
var rij = require('rij');
```

// Start the workers
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

### Events

### Configuration

---

### Utilities
Rij has an HTTP server companion utility that make working with Rij easier:

`oden` - An HTTP server front-end for Rij.
