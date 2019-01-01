import { describe, it } from 'mocha'
import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import {
  makeSetImmediateContext,
  makeSetImmediate,
  tickImmediate,
} from '../src'

const EMPTY_MAP = new Map()
const EMPTY_ARRAY: any[] = []

describe('[ tickImmediate ]', () => {
  it('single setImmediate', async () => {
    const context = makeSetImmediateContext()
    const spy = createSpy(() => {})
    const setImmediate = makeSetImmediate(context)
    const tick = tickImmediate(context)

    setImmediate(spy)

    tick()

    expect(context).deep.eq({
      id: 1,
      state: EMPTY_MAP,
      setCalls: [
        {},
      ],
      clearCalls: EMPTY_ARRAY,
    })
    expect(getSpyCalls(spy)).deep.eq([[]])
  })

  it('multiple setImmediate', async () => {
    const context = makeSetImmediateContext()
    const spy0 = createSpy(() => {})
    const spy1 = createSpy(() => {})
    const spy2 = createSpy(() => {})
    const setImmediate = makeSetImmediate(context)
    const tick = tickImmediate(context)

    setImmediate(spy0)
    setImmediate(spy1)
    setImmediate(spy2)

    tick()

    expect(context).deep.eq({
      id: 3,
      state: EMPTY_MAP,
      setCalls: [
        {},
        {},
        {},
      ],
      clearCalls: EMPTY_ARRAY,
    })
    expect(getSpyCalls(spy0)).deep.eq([[]])
    expect(getSpyCalls(spy1)).deep.eq([[]])
    expect(getSpyCalls(spy2)).deep.eq([[]])
  })

  it('tick default, no setImmediate', async () => {
    const context = makeSetImmediateContext()
    const tick = tickImmediate(context)

    tick()

    expect(context).deep.eq({
      id: 0,
      state: EMPTY_MAP,
      setCalls: [],
      clearCalls: EMPTY_ARRAY,
    })
  })
})
