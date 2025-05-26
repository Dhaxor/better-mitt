// Example demonstrating TypeScript support in better-mitt

import mitt, { Emitter } from './src/index';

// Define event types
type Events = {
  userLoggedIn: { userId: string; timestamp: number };
  userLoggedOut: { userId: string; timestamp: number };
  notification: { message: string; type: 'info' | 'warning' | 'error' };
  dataUpdated: { entityId: string; data: unknown };
};

// Create a typed emitter
const emitter = mitt<Events>();

// Type-safe event handlers
const userLoginHandler = (event: Events['userLoggedIn']) => {
  console.log(`User ${event.userId} logged in at ${new Date(event.timestamp).toISOString()}`);
};

const userLogoutHandler = (event: Events['userLoggedOut']) => {
  console.log(`User ${event.userId} logged out at ${new Date(event.timestamp).toISOString()}`);
};

const notificationHandler = (event: Events['notification']) => {
  console.log(`[${event.type.toUpperCase()}] ${event.message}`);
};

// Wildcard handler - receives all events
const auditLogger = (type: keyof Events, event: Events[keyof Events]) => {
  console.log(`[AUDIT] Event ${String(type)} received:`, event);
};

// Register the handlers
emitter.on('userLoggedIn', userLoginHandler);
emitter.on('userLoggedOut', userLogoutHandler);
emitter.on('notification', notificationHandler);
emitter.on('*', auditLogger);

// One-time handler
emitter.once('dataUpdated', (event) => {
  console.log(`Data updated for ${event.entityId} - will only show once`);
});

// This would cause a TypeScript error:
// emitter.emit('userLoggedIn', { userId: 123, timestamp: Date.now() });
// Error: Type 'number' is not assignable to type 'string'

// These are all type-safe:
emitter.emit('userLoggedIn', { userId: 'user123', timestamp: Date.now() });
emitter.emit('notification', { message: 'Server is running low on memory', type: 'warning' });
emitter.emit('userLoggedOut', { userId: 'user123', timestamp: Date.now() });

// This will fire once, then be removed
emitter.emit('dataUpdated', { entityId: 'post-123', data: { title: 'New Post' } });

// This won't fire the one-time handler, as it was already used
emitter.emit('dataUpdated', { entityId: 'post-456', data: { title: 'Another Post' } });

// Check for listeners
console.log('Has notification listeners?', emitter.hasListeners('notification')); // true

// Remove a specific handler
emitter.off('userLoggedIn', userLoginHandler);

// Clear all handlers for an event
emitter.off('notification');

// Clear all handlers
emitter.clear();