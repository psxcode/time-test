import { describe, it } from 'mocha'
import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import {
  makeSetIntervalContext,
  makeSetInterval,
  makeClearInterval,
} from '../src'

const EMPTY_MAP = new Map()
const EMPTY_ARRAY: any[] = []

describe('[ makeClearInterval ]', () => {
  it('single clearInterval', async () => {
    const context = makeSetIntervalContext()
    const spy = createSpy(() => {})
    const setInterval = makeSetInterval(context)
    const clearInterval = makeClearInterval(context)

    const id = setInterval(spy, 100)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy, delay: 100, invokeTime: 100 }],
      ])
    )

    clearInterval(id)

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

  it('multiple makeClearInterval', async () => {
    const context = makeSetIntervalContext()
    const spy0 = createSpy(() => {})
    const spy1 = createSpy(() => {})
    const spy2 = createSpy(() => {})
    const setInterval = makeSetInterval(context)
    const clearInterval = makeClearInterval(context)

    const id0 = setInterval(spy0, 11)
    const id1 = setInterval(spy1, 22)
    const id2 = setInterval(spy2, 33)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy0, delay: 11, invokeTime: 11 }],
        [1, { cb: spy1, delay: 22, invokeTime: 22 }],
        [2, { cb: spy2, delay: 33, invokeTime: 33 }],
      ])
    )

    clearInterval(id2)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy0, delay: 11, invokeTime: 11 }],
        [1, { cb: spy1, delay: 22, invokeTime: 22 }],
      ])
    )

    clearInterval(id1)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy0, delay: 11, invokeTime: 11 }],
      ])
    )

    clearInterval(id0)

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

  it('clearInterval, non-existent id', async () => {
    const context = makeSetIntervalContext()
    const spy = createSpy(() => {})
    const setInterval = makeSetInterval(context)
    const clearInterval = makeClearInterval(context)

    const id = setInterval(spy, 100)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy, delay: 100, invokeTime: 100 }],
      ])
    )

    clearInterval(32)

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
