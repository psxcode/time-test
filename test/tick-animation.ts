import { describe, it } from 'mocha'
import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import {
  makeRequestAnimationFrameContext,
  makeRequestAnimationFrame,
  tickAnimation,
} from '../src'

const EMPTY_MAP = new Map()
const EMPTY_ARRAY: any[] = []

describe('[ tickAnimation ]', () => {
  it('single setImmediate', async () => {
    const context = makeRequestAnimationFrameContext()
    const spy = createSpy(() => {})
    const requestAnimationFrame = makeRequestAnimationFrame(context)
    const tick = tickAnimation(context)

    requestAnimationFrame(spy)

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
    const context = makeRequestAnimationFrameContext()
    const spy0 = createSpy(() => {})
    const spy1 = createSpy(() => {})
    const spy2 = createSpy(() => {})
    const requestAnimationFrame = makeRequestAnimationFrame(context)
    const tick = tickAnimation(context)

    requestAnimationFrame(spy0)
    requestAnimationFrame(spy1)
    requestAnimationFrame(spy2)

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

  it('tick default, no requestAnimationFrame', async () => {
    const context = makeRequestAnimationFrameContext()
    const tick = tickAnimation(context)

    tick()

    expect(context).deep.eq({
      id: 0,
      state: EMPTY_MAP,
      setCalls: [],
      clearCalls: EMPTY_ARRAY,
    })
  })
})
