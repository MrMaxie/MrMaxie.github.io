I built **@maxiedev/events** as a focused event emitter for TypeScript applications. Event names and their argument tuples are defined as one type, so listeners and emitted values stay <mark>checked against the same contract</mark> throughout the application.

## Typed event contracts

The API covers the common event flow without recreating the entire Node.js EventEmitter surface.

- Register persistent or one-time listeners with **on** and **once**.
- Emit only known events with the argument types assigned to them.
- Remove individual listeners or clear the listeners for an event.

## Async support

Events can also be consumed as part of asynchronous control flow. The package can wait for the next event, apply a timeout that resolves or throws, and expose repeated emissions through an <mark>async generator</mark>. This makes the same typed contract useful for callbacks, promises and streams.

## Small by design

The package has <mark>no runtime dependencies</mark> and keeps error handling explicit. Listener failures can be routed to error handlers or thrown according to the selected policy, while subscription methods provide direct cleanup functions.

## Example

```typescript
import { createEmitter } from '@maxiedev/events';

const events = createEmitter<{ saved: [id: string] }>();
events.on('saved', id => console.log(id));
events.emit('saved', 'item-42');
```

## How I built it

I designed and implemented the generic TypeScript API, asynchronous waiting and streaming helpers, listener lifecycle and error behavior. I packaged the library as a public, dependency-free npm module with its types available directly to consumers.
