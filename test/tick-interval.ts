import { describe, it } from 'mocha'
import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import {
  makeSetIntervalContext,
  makeSetInterval,
  tickInterval,
} from '../src'

const EMPTY_MAP = new Map()
const EMPTY_ARRAY: any[] = []

describe('[ tickInterval ]', () => {
  it('single setInterval, tick default', async () => {
    const context = makeSetIntervalContext()
    const spy = createSpy(() => {})
    const setInterval = makeSetInterval(context)
    const tick = tickInterval(context)

    setInterval(spy, 100)

    tick()

    expect(context).deep.eq({
      id: 1,
      time: 100,
      state: new Map([
        [0, { cb: spy, delay: 100, invokeTime: 200 }],
      ]),
      setCalls: [
        { delay: 100 },
      ],
      clearCalls: EMPTY_ARRAY,
    })
    expect(getSpyCalls(spy)).deep.eq([[]])
  })

  it('single setInterval, tick time', async () => {
    const context = makeSetIntervalContext()
    const spy = createSpy(() => {})
    const setInterval = makeSetInterval(context)
    const tick = tickInterval(context)

    setInterval(spy, 100)

    tick(200)

    expect(context).deep.eq({
      id: 1,
      time: 200,
      state: new Map([
        [0, { cb: spy, delay: 100, invokeTime: 300 }],
      ]),
      setCalls: [
        { delay: 100 },
      ],
      clearCalls: EMPTY_ARRAY,
    })
    expect(getSpyCalls(spy)).deep.eq([[]])
  })

  it('multiple setInterval, tick default', async () => {
    const context = makeSetIntervalContext()
    const spy0 = createSpy(() => {})
    const spy1 = createSpy(() => {})
    const spy2 = createSpy(() => {})
    const setInterval = makeSetInterval(context)
    const tick = tickInterval(context)

    setInterval(spy0, 33)
    setInterval(spy1, 22)
    setInterval(spy2, 11)

    tick()

    expect(context).deep.eq({
      id: 3,
      time: 11,
      state: new Map([
        [0, { cb: spy0, delay: 33, invokeTime: 33 }],
        [1, { cb: spy1, delay: 22, invokeTime: 22 }],
        [2, { cb: spy2, delay: 11, invokeTime: 22 }],
      ]),
      setCalls: [
        { delay: 33 },
        { delay: 22 },
        { delay: 11 },
      ],
      clearCalls: EMPTY_ARRAY,
    })
    expect(getSpyCalls(spy0)).deep.eq([])
    expect(getSpyCalls(spy1)).deep.eq([])
    expect(getSpyCalls(spy2)).deep.eq([[]])

    tick()

    expect(context).deep.eq({
      id: 3,
      time: 22,
      state: new Map([
        [0, { cb: spy0, delay: 33, invokeTime: 33 }],
        [1, { cb: spy1, delay: 22, invokeTime: 44 }],
        [2, { cb: spy2, delay: 11, invokeTime: 33 }],
      ]),
      setCalls: [
        { delay: 33 },
        { delay: 22 },
        { delay: 11 },
      ],
      clearCalls: EMPTY_ARRAY,
    })
    expect(getSpyCalls(spy0)).deep.eq([])
    expect(getSpyCalls(spy1)).deep.eq([[]])
    expect(getSpyCalls(spy2)).deep.eq([[], []])

    tick()

    expect(context).deep.eq({
      id: 3,
      time: 33,
      state: new Map([
        [0, { cb: spy0, delay: 33, invokeTime: 66 }],
        [1, { cb: spy1, delay: 22, invokeTime: 44 }],
        [2, { cb: spy2, delay: 11, invokeTime: 44 }],
      ]),
      setCalls: [
        { delay: 33 },
        { delay: 22 },
        { delay: 11 },
      ],
      clearCalls: EMPTY_ARRAY,
    })
    expect(getSpyCalls(spy0)).deep.eq([[]])
    expect(getSpyCalls(spy1)).deep.eq([[]])
    expect(getSpyCalls(spy2)).deep.eq([[], [], []])
  })

  it('multiple setInterval, tick time', async () => {
    const context = makeSetIntervalContext()
    const spy0 = createSpy(() => {})
    const spy1 = createSpy(() => {})
    const spy2 = createSpy(() => {})
    const setInterval = makeSetInterval(context)
    const tick = tickInterval(context)

    setInterval(spy0, 33)
    setInterval(spy1, 22)
    setInterval(spy2, 11)

    tick(25)

    expect(context).deep.eq({
      id: 3,
      time: 25,
      state: new Map([
        [0, { cb: spy0, delay: 33, invokeTime: 33 }],
        [1, { cb: spy1, delay: 22, invokeTime: 47 }],
        [2, { cb: spy2, delay: 11, invokeTime: 36 }],
      ]),
      setCalls: [
        { delay: 33 },
        { delay: 22 },
        { delay: 11 },
      ],
      clearCalls: EMPTY_ARRAY,
    })
    expect(getSpyCalls(spy0)).deep.eq([])
    expect(getSpyCalls(spy1)).deep.eq([[]])
    expect(getSpyCalls(spy2)).deep.eq([[]])

    tick(35)

    expect(context).deep.eq({
      id: 3,
      time: 60,
      state: new Map([
        [0, { cb: spy0, delay: 33, invokeTime: 93 }],
        [1, { cb: spy1, delay: 22, invokeTime: 82 }],
        [2, { cb: spy2, delay: 11, invokeTime: 71 }],
      ]),
      setCalls: [
        { delay: 33 },
        { delay: 22 },
        { delay: 11 },
      ],
      clearCalls: EMPTY_ARRAY,
    })
    expect(getSpyCalls(spy0)).deep.eq([[]])
    expect(getSpyCalls(spy1)).deep.eq([[], []])
    expect(getSpyCalls(spy2)).deep.eq([[], []])
  })

  it('tick default, no setInterval', async () => {
    const context = makeSetIntervalContext()
    const tick = tickInterval(context)

    tick()

    expect(context).deep.eq({
      id: 0,
      time: 0,
      state: EMPTY_MAP,
      setCalls: [],
      clearCalls: EMPTY_ARRAY,
    })
  })
})
