import { describe, it } from 'mocha'
import { expect } from 'chai'
import {
  makeSetTimeoutContext,
  makeSetTimeout,
  getSetTimeoutCalls,
  makeClearTimeout,
  getClearTimeoutCalls,
  makeSetIntervalContext,
  makeSetInterval,
  getSetIntervalCalls,
  getClearIntervalCalls,
  makeClearInterval,
  makeSetImmediateContext,
  makeSetImmediate,
  makeClearImmediate,
  getSetImmediateCalls,
  getClearImmediateCalls,
  makeRequestAnimationFrameContext,
  makeRequestAnimationFrame,
  makeCancelAnimationFrame,
  getRequestAnimationCallsCalls,
  getCancelAnimationFrameCalls,
} from '../src'

describe('[ getSetTimeoutCalls, getClearTimeoutCalls ]', () => {
  it('should return calls', () => {
    const context = makeSetTimeoutContext()
    const setTimeout = makeSetTimeout(context)
    const clearTimeout = makeClearTimeout(context)

    const id0 = setTimeout(() => {}, 100)
    const id1 = setTimeout(() => {}, 200)
    const id2 = setTimeout(() => {}, 300)

    clearTimeout(id2)
    clearTimeout(id1)
    clearTimeout(id0)

    expect(getSetTimeoutCalls(context)).deep.eq([
      { delay: 100 },
      { delay: 200 },
      { delay: 300 },
    ])

    expect(getClearTimeoutCalls(context)).deep.eq([
      { id: 2 },
      { id: 1 },
      { id: 0 },
    ])
  })
})

describe('[ getSetIntervalCalls, getClearIntervalCalls ]', () => {
  it('should return calls', () => {
    const context = makeSetIntervalContext()
    const setInterval = makeSetInterval(context)
    const clearInterval = makeClearInterval(context)

    const id0 = setInterval(() => {}, 100)
    const id1 = setInterval(() => {}, 200)
    const id2 = setInterval(() => {}, 300)

    clearInterval(id2)
    clearInterval(id1)
    clearInterval(id0)

    expect(getSetIntervalCalls(context)).deep.eq([
      { delay: 100 },
      { delay: 200 },
      { delay: 300 },
    ])

    expect(getClearIntervalCalls(context)).deep.eq([
      { id: 2 },
      { id: 1 },
      { id: 0 },
    ])
  })
})

describe('[ getSetImmediateCalls, getClearImmediateCalls ]', () => {
  it('should return calls', () => {
    const context = makeSetImmediateContext()
    const setImmediate = makeSetImmediate(context)
    const clearImmediate = makeClearImmediate(context)

    const id0 = setImmediate(() => {})
    const id1 = setImmediate(() => {})
    const id2 = setImmediate(() => {})

    clearImmediate(id2)
    clearImmediate(id1)
    clearImmediate(id0)

    expect(getSetImmediateCalls(context)).deep.eq([
      {},
      {},
      {},
    ])

    expect(getClearImmediateCalls(context)).deep.eq([
      { id: 2 },
      { id: 1 },
      { id: 0 },
    ])
  })
})

describe('[ getRequestAnimationFrameCalls, getCancelAnimationFrameCalls ]', () => {
  it('should return calls', () => {
    const context = makeRequestAnimationFrameContext()
    const requestAnimationFrame = makeRequestAnimationFrame(context)
    const cancelAnimationFrame = makeCancelAnimationFrame(context)

    const id0 = requestAnimationFrame(() => {})
    const id1 = requestAnimationFrame(() => {})
    const id2 = requestAnimationFrame(() => {})

    cancelAnimationFrame(id2)
    cancelAnimationFrame(id1)
    cancelAnimationFrame(id0)

    expect(getRequestAnimationCallsCalls(context)).deep.eq([
      {},
      {},
      {},
    ])

    expect(getCancelAnimationFrameCalls(context)).deep.eq([
      { id: 2 },
      { id: 1 },
      { id: 0 },
    ])
  })
})
