import { describe, it } from 'mocha'
import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import {
  makeSetImmediateContext,
  makeSetImmediate,
  makeClearImmediate,
} from '../src'

const EMPTY_MAP = new Map()
const EMPTY_ARRAY: any[] = []

describe('[ makeClearImmediate ]', () => {
  it('single clearImmediate', async () => {
    const context = makeSetImmediateContext()
    const spy = createSpy(() => {})
    const setImmediate = makeSetImmediate(context)
    const clearImmediate = makeClearImmediate(context)

    const id = setImmediate(spy)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy }],
      ])
    )

    clearImmediate(id)

    expect(context).deep.eq({
      id: 1,
      state: EMPTY_MAP,
      setCalls: [
        {},
      ],
      clearCalls: [
        { id: 0 },
      ],
    })
    expect(getSpyCalls(spy)).deep.eq([])
  })

  it('multiple makeClearImmediate', async () => {
    const context = makeSetImmediateContext()
    const spy0 = createSpy(() => {})
    const spy1 = createSpy(() => {})
    const spy2 = createSpy(() => {})
    const setImmediate = makeSetImmediate(context)
    const clearImmediate = makeClearImmediate(context)

    const id0 = setImmediate(spy0)
    const id1 = setImmediate(spy1)
    const id2 = setImmediate(spy2)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy0 }],
        [1, { cb: spy1 }],
        [2, { cb: spy2 }],
      ])
    )

    clearImmediate(id2)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy0 }],
        [1, { cb: spy1 }],
      ])
    )

    clearImmediate(id1)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy0 }],
      ])
    )

    clearImmediate(id0)

    expect(context).deep.eq({
      id: 3,
      state: EMPTY_MAP,
      setCalls: [
        {},
        {},
        {},
      ],
      clearCalls: [
        { id: 2 },
        { id: 1 },
        { id: 0 },
      ],
    })
  })

  it('clearImmediate, non-existent id', async () => {
    const context = makeSetImmediateContext()
    const spy = createSpy(() => {})
    const setImmediate = makeSetImmediate(context)
    const clearImmediate = makeClearImmediate(context)

    const id = setImmediate(spy)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy }],
      ])
    )

    clearImmediate(32)

    expect(context).deep.eq({
      id: 1,
      state: new Map([
        [0, { cb: spy }],
      ]),
      setCalls: [
        {},
      ],
      clearCalls: [
        { id: 32 },
      ],
    })
    expect(getSpyCalls(spy)).deep.eq([])
  })
})
