# Better Mitt

Enhanced tiny (~400b) functional event emitter / pubsub with TypeScript support.

🚀 **[Full Documentation and Examples](https://github.com/username/better-mitt)**

## Features

- **Microscopic**: Maintains a small footprint (~400 bytes gzipped)
- **Useful**: Wildcard `"*"` event type listens to all events
- **Familiar**: Same API as Node's EventEmitter and original Mitt
- **Functional**: Methods don't rely on `this`
- **TypeScript Ready**: First-class TypeScript support with generic types
- **Enhanced API**: Adds useful methods like `once()`, `clear()`, `hasListeners()`, and `listenerCount()`
- **Safer Emission**: Protects against modification of handlers during emission

## Quick Start

```javascript
import mitt from 'better-mitt'

const emitter = mitt()

// Listen to events
emitter.on('foo', e => console.log('foo', e))
emitter.on('*', (type, e) => console.log(type, e))

// One-time handler
emitter.once('bar', e => console.log('called once'))

// Fire events
emitter.emit('foo', { a: 'b' })

// Check for listeners
if (emitter.hasListeners('foo')) {
  console.log(`${emitter.listenerCount('foo')} listeners`)
}

// Remove listeners
emitter.off('foo')

// Clear all
emitter.clear()
```

## TypeScript Usage

```typescript
import mitt, { Emitter } from 'better-mitt';

type Events = {
  userLogin: { id: string; time: Date };
  userLogout: { id: string; time: Date };
};

const emitter = mitt<Events>();

// Type-safe event handlers
emitter.on('userLogin', (e) => {
  console.log(`User ${e.id} logged in at ${e.time}`);
});

// Type checking on emit
emitter.emit('userLogin', { 
  id: 'user-123', 
  time: new Date() 
});
```

## License

MIT