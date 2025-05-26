import mitt, { Emitter } from '../src/index';

describe('better-mitt', () => {
  let emitter: Emitter;
  
  beforeEach(() => {
    emitter = mitt();
  });
  
  describe('basic functionality', () => {
    test('exports a function', () => {
      expect(typeof mitt).toBe('function');
    });
    
    test('returns an object with expected methods', () => {
      expect(emitter).toHaveProperty('all');
      expect(emitter).toHaveProperty('on');
      expect(emitter).toHaveProperty('off');
      expect(emitter).toHaveProperty('emit');
      expect(emitter).toHaveProperty('clear');
      expect(emitter).toHaveProperty('once');
      expect(emitter).toHaveProperty('hasListeners');
      expect(emitter).toHaveProperty('listenerCount');
    });
    
    test('initializes with an empty Map', () => {
      expect(emitter.all).toBeInstanceOf(Map);
      expect(emitter.all.size).toBe(0);
    });
  });
  
  describe('on() method', () => {
    test('registers event handlers', () => {
      const handler = jest.fn();
      emitter.on('foo', handler);
      
      expect(emitter.all.has('foo')).toBe(true);
      expect(emitter.all.get('foo')).toContain(handler);
    });
    
    test('can register multiple handlers for an event', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      
      emitter.on('foo', handler1);
      emitter.on('foo', handler2);
      
      const handlers = emitter.all.get('foo');
      expect(handlers).toHaveLength(2);
      expect(handlers).toContain(handler1);
      expect(handlers).toContain(handler2);
    });
    
    test('can register wildcard handlers', () => {
      const wildcardHandler = jest.fn();
      emitter.on('*', wildcardHandler);
      
      expect(emitter.all.has('*')).toBe(true);
      expect(emitter.all.get('*')).toContain(wildcardHandler);
    });
  });
  
  describe('off() method', () => {
    test('removes a specific handler', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      
      emitter.on('foo', handler1);
      emitter.on('foo', handler2);
      emitter.off('foo', handler1);
      
      const handlers = emitter.all.get('foo');
      expect(handlers).toHaveLength(1);
      expect(handlers).not.toContain(handler1);
      expect(handlers).toContain(handler2);
    });
    
    test('removes all handlers for an event when no handler is specified', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      
      emitter.on('foo', handler1);
      emitter.on('foo', handler2);
      emitter.off('foo');
      
      const handlers = emitter.all.get('foo');
      expect(handlers).toHaveLength(0);
    });
    
    test('does nothing when removing a non-existent handler', () => {
      const handler = jest.fn();
      // No handlers registered yet
      emitter.off('foo', handler);
      
      // Should not throw and should be a no-op
      expect(emitter.all.has('foo')).toBe(false);
    });
  });
  
  describe('emit() method', () => {
    test('invokes all handlers for an event type', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      const eventData = { a: 'b' };
      
      emitter.on('foo', handler1);
      emitter.on('foo', handler2);
      emitter.emit('foo', eventData);
      
      expect(handler1).toHaveBeenCalledWith(eventData);
      expect(handler2).toHaveBeenCalledWith(eventData);
    });
    
    test('invokes wildcard handlers for all events', () => {
      const wildcardHandler = jest.fn();
      const fooHandler = jest.fn();
      const barHandler = jest.fn();
      
      emitter.on('*', wildcardHandler);
      emitter.on('foo', fooHandler);
      emitter.on('bar', barHandler);
      
      emitter.emit('foo', 'foo-data');
      emitter.emit('bar', 'bar-data');
      
      expect(wildcardHandler).toHaveBeenCalledTimes(2);
      expect(wildcardHandler).toHaveBeenCalledWith('foo', 'foo-data');
      expect(wildcardHandler).toHaveBeenCalledWith('bar', 'bar-data');
      
      expect(fooHandler).toHaveBeenCalledTimes(1);
      expect(fooHandler).toHaveBeenCalledWith('foo-data');
      
      expect(barHandler).toHaveBeenCalledTimes(1);
      expect(barHandler).toHaveBeenCalledWith('bar-data');
    });
    
    test('does nothing when emitting an event with no handlers', () => {
      // This should not throw an error
      emitter.emit('foo', { a: 'b' });
    });
    
    test('handlers are invoked in the order they were added', () => {
      const results: number[] = [];
      
      emitter.on('foo', () => results.push(1));
      emitter.on('foo', () => results.push(2));
      emitter.on('foo', () => results.push(3));
      
      emitter.emit('foo', null);
      
      expect(results).toEqual([1, 2, 3]);
    });
    
    test('handlers added during emit are not called in the same emit cycle', () => {
      const results: number[] = [];
      
      emitter.on('foo', () => {
        results.push(1);
        // Add a new handler during emit
        emitter.on('foo', () => results.push(3));
      });
      
      emitter.on('foo', () => results.push(2));
      
      emitter.emit('foo', null);
      // The handler added during emit should not be called in this cycle
      expect(results).toEqual([1, 2]);
      
      // But it should be called in the next emit cycle
      emitter.emit('foo', null);
      expect(results).toEqual([1, 2, 1, 2, 3]);
    });
    
    test('handlers can be removed during emit, but will still be called in the same cycle', () => {
      const handler1 = jest.fn(() => {
        // Remove handler2 during emit
        emitter.off('foo', handler2);
      });
      
      const handler2 = jest.fn();
      const handler3 = jest.fn();
      
      emitter.on('foo', handler1);
      emitter.on('foo', handler2);
      emitter.on('foo', handler3);
      
      emitter.emit('foo', null);
      
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1); // Will still be called in this cycle
      expect(handler3).toHaveBeenCalledTimes(1);
      
      // But in the next cycle, it should be gone
      emitter.emit('foo', null);
      expect(handler1).toHaveBeenCalledTimes(2);
      expect(handler2).toHaveBeenCalledTimes(1); // Not called again
      expect(handler3).toHaveBeenCalledTimes(2);
    });
  });
  
  describe('clear() method', () => {
    test('removes all event handlers', () => {
      emitter.on('foo', () => {});
      emitter.on('bar', () => {});
      emitter.on('*', () => {});
      
      expect(emitter.all.size).toBe(3);
      
      emitter.clear();
      
      expect(emitter.all.size).toBe(0);
    });
  });
  
  describe('once() method', () => {
    test('handler is called only once', () => {
      const handler = jest.fn();
      
      emitter.once('foo', handler);
      
      emitter.emit('foo', 'first');
      emitter.emit('foo', 'second');
      
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith('first');
      expect(handler).not.toHaveBeenCalledWith('second');
    });
    
    test('once with wildcard handler', () => {
      const handler = jest.fn();
      
      emitter.once('*', handler);
      
      emitter.emit('foo', 'data1');
      emitter.emit('bar', 'data2');
      
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith('foo', 'data1');
    });
  });
  
  describe('hasListeners() method', () => {
    test('returns true when event has handlers', () => {
      emitter.on('foo', () => {});
      
      expect(emitter.hasListeners('foo')).toBe(true);
    });
    
    test('returns false when event has no handlers', () => {
      expect(emitter.hasListeners('foo')).toBe(false);
      
      emitter.on('foo', () => {});
      emitter.off('foo');
      
      expect(emitter.hasListeners('foo')).toBe(false);
    });
  });
  
  describe('listenerCount() method', () => {
    test('returns correct count of handlers', () => {
      expect(emitter.listenerCount('foo')).toBe(0);
      
      emitter.on('foo', () => {});
      expect(emitter.listenerCount('foo')).toBe(1);
      
      emitter.on('foo', () => {});
      expect(emitter.listenerCount('foo')).toBe(2);
      
      emitter.off('foo');
      expect(emitter.listenerCount('foo')).toBe(0);
    });
  });
  
  describe('TypeScript types', () => {
    test('typed events', () => {
      type Events = {
        foo: string;
        bar: number;
        baz: { name: string };
      };
      
      const typedEmitter = mitt<Events>();
      
      const fooHandler = (data: string) => {};
      const barHandler = (data: number) => {};
      const bazHandler = (data: { name: string }) => {};
      const wildcardHandler = (type: keyof Events, data: any) => {};
      
      typedEmitter.on('foo', fooHandler);
      typedEmitter.on('bar', barHandler);
      typedEmitter.on('baz', bazHandler);
      typedEmitter.on('*', wildcardHandler);
      
      typedEmitter.emit('foo', 'test');
      typedEmitter.emit('bar', 123);
      typedEmitter.emit('baz', { name: 'test' });
      
      // These shouldn't throw type errors during test execution
      expect(true).toBe(true);
    });
  });
});