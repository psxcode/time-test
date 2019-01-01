# time-test

setTimeout, setInterval, setImmediate, requestAnimationFrame

### Install
```
npm install time-test
```

### `SetTimeoutContext`
Stores state for `setTimeout`, `clearTimeout` pair
```ts
{
  // next setTimeout ID
  id: number,

  // current time
  time: number,

  // Map of IDs to state of pending setTimeout callbacks
  // invokeTime shows next time this callback will be invoked
  state: Map<number, { id: number, delay: number, invokeTime: number }>,

  // all calls to setTimeout
  setCalls: Array<{ delay: number }>,

  // all calls to clearTimeout
  clearCalls: Array<{ id: number }>
}
```

### `makeSetTimeout`
`(context: SetTimeoutContext) => (callback: () => any, delay: number) => number`
```ts
import {
  makeSetTimeout,
  makeSetTimeoutContext,
  tickTimeout
} from 'time-test'

// create context
const context = makeSetTimeoutContext()

// create setTimeout
const setTimeout = makeSetTimeout(context)
const tick = tickTimeout(context)

// set a couple of callbacks
const id0 = setTimeout(() => { console.log('cb0 invoked') }, 100)
const id1 = setTimeout(() => { console.log('cb1 invoked') }, 200)
const id2 = setTimeout(() => { console.log('cb2 invoked') }, 300)

// tick till NEXT callback in queue,
// this effectively forwards 100ms
// callback is fired synchronously
tick()  // -> cb0 invoked

// tick with provided timeStep
// lets pass another 250ms
tick(250) // -> cb1 invoked  -> cb2 invoked

// check the state
expect(context).deep.eq(
  id: 3,               // next id to return,
  time: 350,           // current time
  state: EMPTY_MAP,    // all callbacks invoked and removed
  setCalls: [          // all calls to setTimeout
    { delay: 100 }, { delay: 200 }, { delay: 300 }
  ],
  clearCalls: []       // no calls to clearTimeout
)
```

### `makeClearTimeout`
`(context: SetTimeoutContext) => (id: number) => void`
```ts
import {
  makeSetTimeout,
  makeSetTimeoutContext,
  makeClearTimeout,
} from 'time-test'

// create context
const context = makeSetTimeoutContext()

// create setTimeout
const setTimeout = makeSetTimeout(context)
// create clearTimeout
const clearTimeout = makeClearTimeout(context)

const id = setTimeout(() => {}, 100)

// clear by id
clearTimeout(id)

// check the state
expect(context).deep.eq(
  id: 1,               // next id to return,
  time: 0,             // current time
  state: EMPTY_MAP,    // all callbacks removed
  setCalls: [
    { delay: 100 }     // all calls to setTimeout
  ],
  clearCalls: [
    { id: 0 }          // all calls to clearTimeout
  ]
)
```

### `makeSetInterval`
`(context: SetIntervalContext) => (callback: () => any, delay: number) => number`
```ts
import {
  makeSetInterval,
  makeSetIntervalContext,
  tickInterval
} from 'time-test'

// create context
const context = makeSetIntervalContext()

// create setInterval
const setInterval = makeSetInterval(context)
const tick = tickInterval(context)

// set a couple of callbacks
const cb0 = () => { console.log('cb0 invoked') }
const cb1 = () => { console.log('cb1 invoked') }
const id0 = setInterval(cb0, 100)
const id1 = setInterval(cb1, 200)

// tick till NEXT callback in queue,
// this effectively forwards 100ms
// callback is fired synchronously
tick()  // -> cb0 invoked

// tick with provided timeStep
// lets pass another 250ms
tick(250) // -> cb0 invoked  -> cb1 invoked

// check the state
expect(context).deep.eq(
  id: 2,               // next id to return,
  time: 350,           // current time
  state: new Map([
    [0, { cb: cb0, delay: 100, invokeTime: 350 }]
  ]),
  setCalls: [          // all calls to setInterval
    { delay: 100 }, { delay: 200 }
  ],
  clearCalls: []       // no calls to clearInterval
)
```

### `onceAllEx`
`(...events: string[]) => (callback: (val: { value: any, event: string, index: number, emitter: EventEmitter, emitterIndex: number }) => void) => (...emitters: EventEmitter[]) => () => void`
```ts
import { onceAll } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

const observer = onceAll(
  'data',
  'end'    // events to listen
)(
  ({ value, event, index, emitter, emitterIndex }) => {} // your callback
)

const unsub = observer(e0, e1) // subscribe to emitters, return unsubscribe function

// unsubscribe
unsub()
```

### `onceAllPromise`
`(...events: string[]) => (...emitters: EventEmitter[]) => Promise<any[]>`
```ts
import { onceAllPromise } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

onceAllPromise(
  'data', // events to listen
)(
  e0,
  e1
).then(([valueFromEmitter0, valueFromEmitter1]) => {
  // your callback
})
```

### `onceAllExPromise`
`(...events: string[]) => (...emitters: EventEmitter[]) => Promise<{ value: any, event: string, index: number, emitter: EventEmitter, emitterIndex: number }[]>`
```ts
import { onceAllPromise } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

onceAllPromise(
  'data' // events to listen
)(
  e0,
  e1
).then(([emitterExValue0, emitterExValue1]) => {
  // your callback
})
```

### `onceAllPromiseReject`
`(rejectEvents: string[], resolveEvents: string[]) => (...emitters: EventEmitter[]) => Promise<any[]>`
```ts
import { onceAllPromise } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

onceAllPromise(['error'], ['data'])(
  e0,
  e1
).then(([ valueFromEmitter0, valueFromEmitter1 ]) => {
  // your callback
}).catch((error: any) => {
  // your error handler
})
```

### `onceAllExPromiseReject`
`(rejectEvents: string[], resolveEvents: string[]) => (...emitters: EventEmitter[]) => Promise<{ value: any, event: string, index: number, emitter: EventEmitter, emitterIndex: number }[]>`
```ts
import { onceAllPromise } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

onceAllPromise(['error'], ['data'])(
  e0,
  e1
).then(([ valueExFromEmitter0, valueExFromEmitter1 ]) => {
  // your callback
}).catch(({ value, event, index, emitterIndex, emitter }) => {
  // your error handler
})
```

### `onceRace`
`(...events: string[]) => (callback: (val: any) => void) => (...emitters: EventEmitter[]) => () => void`
```ts
import { onceRace } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

const observer = onceRace(
  'data',
  'end'    // events to listen
)(
  (value: any) => {} // your callback
)

const unsub = observer(
  e0,
  e1        // subscribe to emitters
) // return unsubscribe function

// unsubscribe
unsub()
```

### `onceRaceEx`
`(...events: string[]) => (callback: (val: { value: any, event: string, index: number, emitterIndex: number, emitter: EventEmitter }) => void) => (...emitters: EventEmitter[]) => () => void`
```ts
import { onceRace } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

const observer = onceRace(
  'data',
  'end'    // events to listen
)(
  ({ value: any, emitterIndex: number, emitter: EventEmitter }) => {} // your callback
)

const unsub = observer(
  e0,
  e1        // subscribe to emitters
) // return unsubscribe function

// unsubscribe
unsub()
```

### `onceRacePromise`
`(...events: string[]) => (...emitters: EventEmitter[]) => Promise<any>`
```ts
import { onceRacePromise } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

onceRacePromise(
  'data',
  'end'    // events to listen
)(
  e0,
  e1       // subscribe to emitters
).then((value: any) => {
  // your callback
})
```

### `onceRaceExPromise`
`(...events: string[]) => (...emitters: EventEmitter[]) => Promise<{ value: any, event: string, index: number, emitterIndex: number, emitter: EventEmitter }>`
```ts
import { onceRaceExPromise } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

onceRacePromiseEx(
  'data',
  'end'    // events to listen
)(
  e0,
  e1       // subscribe to emitters
).then(({ value, event, index, emitterIndex, emitter }) => {
  // your callback
})
```

### `onceRacePromiseReject`
`(...events: string[]) => (...emitters: EventEmitter[]) => Promise<any>`
```ts
import { onceRacePromiseReject } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

onceRacePromise(['error'], ['data'])(
  e0,
  e1       // subscribe to emitters
).then((value: any) => {
  // your callback
}).catch((error: any) => {
  // error handler
})
```

### `onceRaceExPromiseReject`
`(...events: string[]) => (...emitters: EventEmitter[]) => Promise<{ value: any, event: string, index: number, emitterIndex: number, emitter: EventEmitter }>`
```ts
import { onceRaceExPromiseReject } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

onceRacePromiseEx(['error'], ['data'])(
  e0,
  e1       // subscribe to emitters
).then(({ value, event, index, emitterIndex, emitter }) => {
  // your callback
}).catch(({ value, event, index, emitterIndex, emitter }) => {
  // error handler
})
```
