import { describe, it } from 'mocha'
import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import {
  makeRequestAnimationFrameContext,
  makeRequestAnimationFrame,
  makeCancelAnimationFrame,
} from '../src'

const EMPTY_MAP = new Map()
const EMPTY_ARRAY: any[] = []

describe('[ makeCancelAnimationFrame ]', () => {
  it('single CancelAnimationFrame', async () => {
    const context = makeRequestAnimationFrameContext()
    const spy = createSpy(() => {})
    const requestAnimationFrame = makeRequestAnimationFrame(context)
    const cancelAnimationFrame = makeCancelAnimationFrame(context)

    const id = requestAnimationFrame(spy)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy }],
      ])
    )

    cancelAnimationFrame(id)

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

  it('multiple makeCancelAnimationFrame', async () => {
    const context = makeRequestAnimationFrameContext()
    const spy0 = createSpy(() => {})
    const spy1 = createSpy(() => {})
    const spy2 = createSpy(() => {})
    const requestAnimationFrame = makeRequestAnimationFrame(context)
    const cancelAnimationFrame = makeCancelAnimationFrame(context)

    const id0 = requestAnimationFrame(spy0)
    const id1 = requestAnimationFrame(spy1)
    const id2 = requestAnimationFrame(spy2)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy0 }],
        [1, { cb: spy1 }],
        [2, { cb: spy2 }],
      ])
    )

    cancelAnimationFrame(id2)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy0 }],
        [1, { cb: spy1 }],
      ])
    )

    cancelAnimationFrame(id1)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy0 }],
      ])
    )

    cancelAnimationFrame(id0)

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

  it('cancelAnimationFrame, non-existent id', async () => {
    const context = makeRequestAnimationFrameContext()
    const spy = createSpy(() => {})
    const requestAnimationFrame = makeRequestAnimationFrame(context)
    const cancelAnimationFrame = makeCancelAnimationFrame(context)

    const id = requestAnimationFrame(spy)

    expect(context.state).deep.eq(
      new Map([
        [0, { cb: spy }],
      ])
    )

    cancelAnimationFrame(32)

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
