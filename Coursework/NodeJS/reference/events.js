const EventEmitter = require('events');

// Create a class, which inherits EventEmitter
class MyEmitter extends EventEmitter {}
// Initialize an object
const myEmitter = new MyEmitter();
// Create a listener
myEmitter.on('randomEvent', () => {
    console.log("A random event occured");
});
// emit events at random
for (let i = 0; i < 5; ++i) {
    if (Math.random() >= 0.5) {
        myEmitter.emit('randomEvent');
    }
}