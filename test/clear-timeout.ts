import { describe, it } from 'mocha'
import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import {
  makeSetTimeoutContext,
  makeSetTimeout,
  makeClearTimeout,
} from '../src'

const EMPTY_MAP = new Map()
const EMPTY_ARRAY: any[] = []

describe('[ makeClearTimeout ]', () => {
  it('single clearTimeout', async () => {
    const context = makeSetTimeoutContext()
    const spy = createSpy(() => {})
    const setTimeout = makeSetTimeout(context)
    const clearTimeout = makeClearTimeout(context)

    const id = setTimeout(spy, 100)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy, delay: 100, invokeTime: 100 }],
      ])
    )

    clearTimeout(id)

    expect(context).deep.eq({
      id: 1,
      time: 0,
      state: EMPTY_MAP,
      setCalls: [
        { delay: 100 },
      ],
      clearCalls: [
        { id: 0 },
      ],
    })
    expect(getSpyCalls(spy)).deep.eq([])
  })

  it('multiple makeClearTimeout', async () => {
    const context = makeSetTimeoutContext()
    const spy0 = createSpy(() => {})
    const spy1 = createSpy(() => {})
    const spy2 = createSpy(() => {})
    const setTimeout = makeSetTimeout(context)
    const clearTimeout = makeClearTimeout(context)

    const id0 = setTimeout(spy0, 11)
    const id1 = setTimeout(spy1, 22)
    const id2 = setTimeout(spy2, 33)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy0, delay: 11, invokeTime: 11 }],
        [1, { cb: spy1, delay: 22, invokeTime: 22 }],
        [2, { cb: spy2, delay: 33, invokeTime: 33 }],
      ])
    )

    clearTimeout(id2)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy0, delay: 11, invokeTime: 11 }],
        [1, { cb: spy1, delay: 22, invokeTime: 22 }],
      ])
    )

    clearTimeout(id1)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy0, delay: 11, invokeTime: 11 }],
      ])
    )

    clearTimeout(id0)

    expect(context).deep.eq({
      id: 3,
      time: 0,
      state: EMPTY_MAP,
      setCalls: [
        { delay: 11 },
        { delay: 22 },
        { delay: 33 },
      ],
      clearCalls: [
        { id: 2 },
        { id: 1 },
        { id: 0 },
      ],
    })
  })

  it('clearTimeout, non-existent id', async () => {
    const context = makeSetTimeoutContext()
    const spy = createSpy(() => {})
    const setTimeout = makeSetTimeout(context)
    const clearTimeout = makeClearTimeout(context)

    const id = setTimeout(spy, 100)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy, delay: 100, invokeTime: 100 }],
      ])
    )

    clearTimeout(32)

    expect(context).deep.eq({
      id: 1,
      time: 0,
      state: new Map([
        [0, { cb: spy, delay: 100, invokeTime: 100 }],
      ]),
      setCalls: [
        { delay: 100 },
      ],
      clearCalls: [
        { id: 32 },
      ],
    })
    expect(getSpyCalls(spy)).deep.eq([])
  })
})
