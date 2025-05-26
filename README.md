# Better Mitt

Enhanced tiny (~400b) functional event emitter / pubsub with TypeScript support.

## Features

- **Microscopic**: Maintains a small footprint (~400 bytes gzipped)
- **Useful**: Wildcard `"*"` event type listens to all events
- **Familiar**: Same API as Node's EventEmitter and original Mitt
- **Functional**: Methods don't rely on `this`
- **TypeScript Ready**: First-class TypeScript support with generic types
- **Enhanced API**: Adds useful methods like `once()`, `clear()`, `hasListeners()`, and `listenerCount()`
- **Safer Emission**: Protects against modification of handlers during emission

## Installation

```bash
npm install better-mitt
# or
yarn add better-mitt
# or
pnpm add better-mitt
```

## Usage

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
<script src="https://unpkg.com/better-mitt/dist/index.min.js"></script>

<!-- or via jsdelivr -->
<script src="https://cdn.jsdelivr.net/npm/better-mitt/dist/index.min.js"></script>

<script>
  // window.mitt is available
  const emitter = mitt()
</script>
```

## Basic Example

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

## TypeScript Usage

This package includes TypeScript definitions. For best type inference, set `"strict": true` in your `tsconfig.json`.

```typescript
import mitt, { Emitter } from 'better-mitt';

// Define your event types
type Events = {
  foo: string;
  bar?: number;
  baz: { name: string };
};

// Create a typed emitter
const emitter = mitt<Events>();

// Event handlers are properly typed
emitter.on('foo', (e) => {
  // 'e' is inferred as string
  console.log(e.toUpperCase());
});

emitter.on('baz', (e) => {
  // 'e' is inferred as { name: string }
  console.log(e.name);
});

// Type checking on emit
emitter.emit('foo', 'hello'); // OK
emitter.emit('foo', 123); // Error: number is not assignable to string
```

## API

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

## Browser Support

This package works in all modern browsers and IE11+.

## Publishing to npm

If you're forking this package and want to publish your own version, follow these steps:

1. Create an npm account if you don't already have one
2. Update the package name, author, and repository information in `package.json`
3. Login to npm:
   ```bash
   npm login
   ```
4. Publish the package:
   ```bash
   npm publish
   ```

For more information about publishing to npm, see the [npm documentation](https://docs.npmjs.com/packages-and-modules/publishing-npm-packages).

## License

MIT