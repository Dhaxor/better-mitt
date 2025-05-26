# Better Mitt

<div align="center">
  <img src="https://img.shields.io/npm/v/better-mitt.svg" alt="npm version">
  <img src="https://img.shields.io/bundlephobia/minzip/better-mitt" alt="minzipped size">
  <img src="https://img.shields.io/npm/dm/better-mitt.svg" alt="downloads">
  <img src="https://img.shields.io/github/license/username/better-mitt.svg" alt="license">
</div>

<br>

> Enhanced tiny (~400b) functional event emitter / pubsub with TypeScript support.

Better Mitt is an improved version of the popular [Mitt](https://github.com/developit/mitt) event emitter, with additional features and comprehensive TypeScript support, while maintaining a small footprint.

## 🚀 Features

- **Microscopic**: Maintains a small footprint (~400 bytes gzipped)
- **Useful**: Wildcard `"*"` event type listens to all events
- **Familiar**: Same API as Node's EventEmitter and original Mitt
- **Functional**: Methods don't rely on `this`
- **TypeScript Ready**: First-class TypeScript support with generic types
- **Enhanced API**: Adds useful methods like `once()`, `clear()`, `hasListeners()`, and `listenerCount()`
- **Safer Emission**: Protects against modification of handlers during emission

## 📦 Installation

```bash
npm install better-mitt
# or
yarn add better-mitt
# or
pnpm add better-mitt
```

## 🔨 Usage

### ESM (ECMAScript Module)

```javascript
import mitt from 'better-mitt'

const emitter = mitt()
```

### CommonJS

```javascript
const mitt = require('better-mitt').default

const emitter = mitt()
```

### CDN

```html
<!-- UMD via unpkg -->
<script src="https://unpkg.com/better-mitt/dist/index.umd.js"></script>

<!-- or via jsdelivr -->
<script src="https://cdn.jsdelivr.net/npm/better-mitt/dist/index.umd.js"></script>

<script>
  // window.mitt is available
  const emitter = mitt()
</script>
```

## 🌟 Examples

### Basic Usage

```javascript
import mitt from 'better-mitt'

const emitter = mitt()

// listen to an event
emitter.on('foo', e => console.log('foo', e))

// listen to all events
emitter.on('*', (type, e) => console.log(type, e))

// fire an event
emitter.emit('foo', { a: 'b' })

// listen once
emitter.once('bar', e => console.log('bar was called once', e))

// check if has listeners
if (emitter.hasListeners('foo')) {
  console.log('Has foo listeners')
}

// get listener count
console.log(`There are ${emitter.listenerCount('foo')} foo listeners`)

// clearing all events
emitter.clear()

// working with handler references
function onFoo() {}
emitter.on('foo', onFoo)   // listen
emitter.off('foo', onFoo)  // unlisten
```

### TypeScript Usage

This package includes TypeScript definitions. For best type inference, set `"strict": true` in your `tsconfig.json`.

```typescript
import mitt, { Emitter } from 'better-mitt';

// Define your event types
type Events = {
  userLogin: { id: string; time: Date };
  userLogout: { id: string; time: Date };
  notification: { message: string; type: 'info' | 'warning' | 'error' };
};

// Create a typed emitter
const emitter = mitt<Events>();

// Event handlers are properly typed
emitter.on('userLogin', (e) => {
  // 'e' is inferred as { id: string; time: Date }
  console.log(`User ${e.id} logged in at ${e.time}`);
});

// Type checking on emit
emitter.emit('userLogin', { 
  id: 'user-123', 
  time: new Date() 
}); // OK

// This would cause a TypeScript error:
// emitter.emit('userLogin', { id: 123, time: new Date() });
// Error: Type 'number' is not assignable to type 'string'
```

## 📘 API

### mitt()

Creates a mitt event emitter instance.

Returns `Emitter`

### emitter.all

A Map of event names to registered handler functions.

### emitter.on(type, handler)

Register an event handler for the given type.

- `type` (String|Symbol): Type of event to listen for, or `'*'` for all events
- `handler` (Function): Function to call in response to the event

### emitter.off(type, [handler])

Remove an event handler for the given type.

- `type` (String|Symbol): Type of event to unregister `handler` from, or `'*'`
- `handler` (Function) [optional]: Handler function to remove

If `handler` is omitted, all handlers of the given type are removed.

### emitter.emit(type, event)

Invoke all handlers for the given type. If present, `'*'` handlers are invoked after type-matched handlers.

- `type` (String|Symbol): The event type to invoke
- `event` (Any): Any value (object is recommended and powerful), passed to each handler

### emitter.once(type, handler)

Register an event handler that will be called only once.

- `type` (String|Symbol): Type of event to listen for, or `'*'` for all events
- `handler` (Function): Function to call in response to the event

### emitter.clear()

Remove all event handlers.

### emitter.hasListeners(type)

Check if there are any listeners for a given event type.

- `type` (String|Symbol): Type of event to check
- Returns (Boolean): `true` if there are listeners for this event type

### emitter.listenerCount(type)

Get the number of listeners for a given event type.

- `type` (String|Symbol): Type of event to check
- Returns (Number): Number of listeners for this event type

## 🔄 Migration from Mitt

Better Mitt is a drop-in replacement for the original Mitt package. All existing Mitt APIs are preserved, with additional features added.

To migrate from Mitt to Better Mitt:

```bash
npm uninstall mitt
npm install better-mitt
```

Then update your imports:

```javascript
// Change this:
import mitt from 'mitt'

// To this:
import mitt from 'better-mitt'
```

## 📝 License

MIT