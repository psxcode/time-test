import { describe, it } from 'mocha'
import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import { makeRequestAnimationFrameContext, makeRequestAnimationFrame } from '../src'

const EMPTY_MAP = new Map()
const EMPTY_ARRAY: any[] = []

describe('[ makeRequestAnimationFrame ]', () => {
  it('single RequestAnimationFrame', async () => {
    const context = makeRequestAnimationFrameContext()
    const spy = createSpy(() => {})
    const requestAnimationFrame = makeRequestAnimationFrame(context)

    const id = requestAnimationFrame(spy)

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

  it('multiple RequestAnimationFrame', async () => {
    const context = makeRequestAnimationFrameContext()
    const spy0 = createSpy(() => {})
    const spy1 = createSpy(() => {})
    const spy2 = createSpy(() => {})
    const requestAnimationFrame = makeRequestAnimationFrame(context)

    const id0 = requestAnimationFrame(spy0)
    const id1 = requestAnimationFrame(spy1)
    const id2 = requestAnimationFrame(spy2)

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
