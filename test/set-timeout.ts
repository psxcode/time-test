import { describe, it } from 'mocha'
import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import { makeSetTimeoutContext, makeSetTimeout } from '../src'

const EMPTY_MAP = new Map()
const EMPTY_ARRAY: any[] = []

describe('[ makeSetTimeout ]', () => {
  it('single setTimeout', async () => {
    const context = makeSetTimeoutContext()
    const spy = createSpy(() => {})
    const setTimeout = makeSetTimeout(context)

    const id = setTimeout(spy, 100)

    expect(id).eq(0)
    expect(context).deep.eq({
      id: 1,
      time: 0,
      state: new Map([
        [0, { cb: spy, delay: 100, invokeTime: 100 }],
      ]),
      setCalls: [
        { delay: 100 },
      ],
      clearCalls: EMPTY_ARRAY,
    })
    expect(getSpyCalls(spy)).deep.eq([])
  })

  it('multiple setTimeout', async () => {
    const context = makeSetTimeoutContext()
    const spy0 = createSpy(() => {})
    const spy1 = createSpy(() => {})
    const spy2 = createSpy(() => {})
    const setTimeout = makeSetTimeout(context)

    const id0 = setTimeout(spy0, 11)
    const id1 = setTimeout(spy1, 22)
    const id2 = setTimeout(spy2, 33)

    expect(id0).eq(0)
    expect(id1).eq(1)
    expect(id2).eq(2)
    expect(context).deep.eq({
      id: 3,
      time: 0,
      state: new Map([
        [0, { cb: spy0, delay: 11, invokeTime: 11 }],
        [1, { cb: spy1, delay: 22, invokeTime: 22 }],
        [2, { cb: spy2, delay: 33, invokeTime: 33 }],
      ]),
      setCalls: [
        { delay: 11 },
        { delay: 22 },
        { delay: 33 },
      ],
      clearCalls: EMPTY_ARRAY,
    })
    expect(getSpyCalls(spy0)).deep.eq([])
    expect(getSpyCalls(spy1)).deep.eq([])
    expect(getSpyCalls(spy2)).deep.eq([])
  })
})
