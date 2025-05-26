// This is a simple example demonstrating how to use better-mitt

const mitt = require('./dist/index').default;

// Create an emitter
const emitter = mitt();

// Listen to a specific event
emitter.on('foo', (data) => {
  console.log('foo event received:', data);
});

// Listen to all events
emitter.on('*', (type, data) => {
  console.log(`* event received: ${type}`, data);
});

// Create a handler that can be referenced later
function onBar(data) {
  console.log('bar event received:', data);
}

// Register the handler
emitter.on('bar', onBar);

// Register a one-time handler
emitter.once('baz', (data) => {
  console.log('baz event received (once):', data);
});

// Check if an event has listeners
console.log('Has foo listeners?', emitter.hasListeners('foo')); // true
console.log('Has qux listeners?', emitter.hasListeners('qux')); // false

// Get listener count
console.log('Number of foo listeners:', emitter.listenerCount('foo')); // 1
console.log('Number of * listeners:', emitter.listenerCount('*')); // 1

console.log('\n--- Emitting events ---');

// Emit events
emitter.emit('foo', { value: 123 });
emitter.emit('bar', 'hello world');
emitter.emit('baz', [1, 2, 3]);

console.log('\n--- Emitting baz again (should not trigger) ---');
// Emit baz again - the once handler should not be called
emitter.emit('baz', 'not seen');

console.log('\n--- Removing bar handler ---');
// Remove the 'bar' handler
emitter.off('bar', onBar);
console.log('Has bar listeners?', emitter.hasListeners('bar')); // false

// Emit again - should not trigger bar
emitter.emit('bar', 'not seen');

console.log('\n--- Clearing all handlers ---');
// Clear all handlers
emitter.clear();
console.log('Has foo listeners after clear?', emitter.hasListeners('foo')); // false
console.log('Has * listeners after clear?', emitter.hasListeners('*')); // false

// This should not trigger any handlers
console.log('\n--- Emitting after clear (should not trigger) ---');
emitter.emit('foo', 'not seen');