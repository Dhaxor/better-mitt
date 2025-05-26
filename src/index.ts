export type EventType = string | symbol;

// A handler function that can be called with an event
export type Handler<T = any> = (event: T) => void;

// A wildcard handler function that receives both the event type and event data
export type WildcardHandler<T = Record<EventType, any>> = (
  type: keyof T,
  event: T[keyof T]
) => void;

// An object with EventTypes as keys and arrays of Handler functions as values
export type EventHandlerMap<T = Record<EventType, any>> = Map<
  keyof T | '*',
  Array<Handler<T[keyof T]> | WildcardHandler<T>>
>;

export interface Emitter<T = Record<EventType, any>> {
  all: EventHandlerMap<T>;
  on<Key extends keyof T>(type: Key, handler: Handler<T[Key]>): void;
  on(type: '*', handler: WildcardHandler<T>): void;
  off<Key extends keyof T>(type: Key, handler?: Handler<T[Key]>): void;
  off(type: '*', handler?: WildcardHandler<T>): void;
  emit<Key extends keyof T>(type: Key, event: T[Key]): void;
  clear(): void;
  once<Key extends keyof T>(type: Key, handler: Handler<T[Key]>): void;
  once(type: '*', handler: WildcardHandler<T>): void;
  hasListeners<Key extends keyof T | '*'>(type: Key): boolean;
  listenerCount<Key extends keyof T | '*'>(type: Key): number;
}

/**
 * Creates a mitt event emitter instance.
 * 
 * @returns {Emitter} The mitt instance
 */
export default function mitt<T = Record<EventType, any>>(): Emitter<T> {
  const all: EventHandlerMap<T> = new Map();
  const emitter: Emitter<T> = {
    /**
     * A Map of event names to registered handler functions.
     */
    all,

    /**
     * Register an event handler for the given type.
     * @param {string|symbol} type - Type of event to listen for, or '*' for all events
     * @param {Function} handler - Function to call in response to the event
     */
    on(type: keyof T | '*', handler: Handler<T[keyof T]> | WildcardHandler<T>) {
      const handlers = all.get(type);
      if (handlers) {
        handlers.push(handler);
      } else {
        all.set(type, [handler]);
      }
    },

    /**
     * Remove an event handler for the given type.
     * If handler is omitted, all handlers of the given type are removed.
     * @param {string|symbol} type - Type of event to unregister handler from, or '*'
     * @param {Function} [handler] - Handler function to remove
     */
    off(type: keyof T | '*', handler?: Handler<T[keyof T]> | WildcardHandler<T>) {
      const handlers = all.get(type);
      if (handlers) {
        if (handler) {
          handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        } else {
          all.set(type, []);
        }
      }
    },

    /**
     * Invoke all handlers for the given type.
     * If present, '*' handlers are invoked after type-matched handlers.
     * @param {string|symbol} type - The event type to invoke
     * @param {Any} [event] - Any value (object is recommended and powerful), passed to each handler
     */
    emit<Key extends keyof T>(type: Key, event: T[Key]) {
      const handlersToRun: Function[] = [];
      
      // Copy all handlers to a temporary array to avoid issues if handlers are added/removed during emission
      const typeHandlers = all.get(type);
      if (typeHandlers) {
        typeHandlers.slice().forEach(handler => {
          handlersToRun.push(() => (handler as Handler<T[Key]>)(event));
        });
      }
      
      const wildcardHandlers = all.get('*');
      if (wildcardHandlers) {
        wildcardHandlers.slice().forEach(handler => {
          handlersToRun.push(() => (handler as WildcardHandler<T>)(type, event));
        });
      }
      
      // Execute the handlers after collecting them all
      handlersToRun.forEach(invokeHandler => invokeHandler());
    },
    
    /**
     * Clear all event handlers
     */
    clear() {
      all.clear();
    },
    
    /**
     * Register a one-time event handler for the given type.
     * This handler will be automatically removed after being called once.
     * @param {string|symbol} type - Type of event to listen for, or '*' for all events
     * @param {Function} handler - Function to call in response to the event
     */
    once(type: keyof T | '*', handler: Handler<T[keyof T]> | WildcardHandler<T>) {
      const self = this;
      
      // For regular events
      if (type !== '*') {
        const onceHandler = ((event: T[keyof T]) => {
          self.off(type, onceHandler as any);
          (handler as Handler<T[keyof T]>)(event);
        }) as Handler<T[keyof T]>;
        
        self.on(type, onceHandler as any);
      } 
      // For wildcard events
      else {
        const onceWildcardHandler = ((eventType: keyof T, event: T[keyof T]) => {
          self.off('*', onceWildcardHandler as any);
          (handler as WildcardHandler<T>)(eventType, event);
        }) as WildcardHandler<T>;
        
        self.on('*', onceWildcardHandler);
      }
    },
    
    /**
     * Check if there are any listeners for a given event type
     * @param {string|symbol} type - Type of event to check
     * @returns {boolean} True if there are listeners for this event type
     */
    hasListeners<Key extends keyof T | '*'>(type: Key): boolean {
      const handlers = all.get(type);
      return !!handlers && handlers.length > 0;
    },
    
    /**
     * Get the number of listeners for a given event type
     * @param {string|symbol} type - Type of event to check
     * @returns {number} Number of listeners for this event type
     */
    listenerCount<Key extends keyof T | '*'>(type: Key): number {
      const handlers = all.get(type);
      return handlers ? handlers.length : 0;
    }
  };

  return emitter;
}