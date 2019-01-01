import { describe, it } from 'mocha'
import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import {
  makeSetTimeoutContext,
  makeSetTimeout,
  tickTimeout,
} from '../src'

const EMPTY_MAP = new Map()
const EMPTY_ARRAY: any[] = []

describe('[ tickTimeout ]', () => {
  it('single setTimeout, tick default', async () => {
    const context = makeSetTimeoutContext()
    const spy = createSpy(() => {})
    const setTimeout = makeSetTimeout(context)
    const tick = tickTimeout(context)

    setTimeout(spy, 100)

    tick()

    expect(context).deep.eq({
      id: 1,
      time: 100,
      state: EMPTY_MAP,
      setCalls: [
        { delay: 100 },
      ],
      clearCalls: EMPTY_ARRAY,
    })
    expect(getSpyCalls(spy)).deep.eq([[]])
  })

  it('single setTimeout, tick time', async () => {
    const context = makeSetTimeoutContext()
    const spy = createSpy(() => {})
    const setTimeout = makeSetTimeout(context)
    const tick = tickTimeout(context)

    setTimeout(spy, 100)

    tick(200)

    expect(context).deep.eq({
      id: 1,
      time: 200,
      state: EMPTY_MAP,
      setCalls: [
        { delay: 100 },
      ],
      clearCalls: EMPTY_ARRAY,
    })
    expect(getSpyCalls(spy)).deep.eq([[]])
  })

  it('multiple setTimeout, tick default', async () => {
    const context = makeSetTimeoutContext()
    const spy0 = createSpy(() => {})
    const spy1 = createSpy(() => {})
    const spy2 = createSpy(() => {})
    const setTimeout = makeSetTimeout(context)
    const tick = tickTimeout(context)

    setTimeout(spy0, 33)
    setTimeout(spy1, 22)
    setTimeout(spy2, 11)

    tick()

    expect(context).deep.eq({
      id: 3,
      time: 11,
      state: new Map([
        [0, { cb: spy0, delay: 33, invokeTime: 33 }],
        [1, { cb: spy1, delay: 22, invokeTime: 22 }],
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

    tick()

    expect(context).deep.eq({
      id: 3,
      time: 33,
      state: EMPTY_MAP,
      setCalls: [
        { delay: 33 },
        { delay: 22 },
        { delay: 11 },
      ],
      clearCalls: EMPTY_ARRAY,
    })
    expect(getSpyCalls(spy0)).deep.eq([[]])
    expect(getSpyCalls(spy1)).deep.eq([[]])
    expect(getSpyCalls(spy2)).deep.eq([[]])
  })

  it('multiple setTimeout, tick time', async () => {
    const context = makeSetTimeoutContext()
    const spy0 = createSpy(() => {})
    const spy1 = createSpy(() => {})
    const spy2 = createSpy(() => {})
    const setTimeout = makeSetTimeout(context)
    const tick = tickTimeout(context)

    setTimeout(spy0, 33)
    setTimeout(spy1, 22)
    setTimeout(spy2, 11)

    tick(25)

    expect(context).deep.eq({
      id: 3,
      time: 25,
      state: new Map([
        [0, { cb: spy0, delay: 33, invokeTime: 33 }],
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
      state: EMPTY_MAP,
      setCalls: [
        { delay: 33 },
        { delay: 22 },
        { delay: 11 },
      ],
      clearCalls: EMPTY_ARRAY,
    })
    expect(getSpyCalls(spy0)).deep.eq([[]])
    expect(getSpyCalls(spy1)).deep.eq([[]])
    expect(getSpyCalls(spy2)).deep.eq([[]])
  })

  it('tick default, no setTimeout', async () => {
    const context = makeSetTimeoutContext()
    const tick = tickTimeout(context)

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
