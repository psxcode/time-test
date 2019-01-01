import { describe, it } from 'mocha'
import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import { makeSetImmediateContext, makeSetImmediate } from '../src'

const EMPTY_MAP = new Map()
const EMPTY_ARRAY: any[] = []

describe('[ makeSetImmediate ]', () => {
  it('single setImmediate', async () => {
    const context = makeSetImmediateContext()
    const spy = createSpy(() => {})
    const setImmediate = makeSetImmediate(context)

    const id = setImmediate(spy)

    expect(id).eq(0)
    expect(context).deep.eq({
      id: 1,
      state: new Map([
        [0, { cb: spy }],
      ]),
      setCalls: [
        {},
      ],
      clearCalls: EMPTY_ARRAY,
    })
    expect(getSpyCalls(spy)).deep.eq([])
  })

  it('multiple setImmediate', async () => {
    const context = makeSetImmediateContext()
    const spy0 = createSpy(() => {})
    const spy1 = createSpy(() => {})
    const spy2 = createSpy(() => {})
    const setImmediate = makeSetImmediate(context)

    const id0 = setImmediate(spy0)
    const id1 = setImmediate(spy1)
    const id2 = setImmediate(spy2)

    expect(id0).eq(0)
    expect(id1).eq(1)
    expect(id2).eq(2)
    expect(context).deep.eq({
      id: 3,
      state: new Map([
        [0, { cb: spy0 }],
        [1, { cb: spy1 }],
        [2, { cb: spy2 }],
      ]),
      setCalls: [
        {},
        {},
        {},
      ],
      clearCalls: EMPTY_ARRAY,
    })
    expect(getSpyCalls(spy0)).deep.eq([])
    expect(getSpyCalls(spy1)).deep.eq([])
    expect(getSpyCalls(spy2)).deep.eq([])
  })
})
