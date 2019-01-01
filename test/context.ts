import { describe, it } from 'mocha'
import { expect } from 'chai'
import {
  makeSetTimeoutContext,
  makeSetIntervalContext,
  makeSetImmediateContext,
  makeRequestAnimationFrameContext,
} from '../src'

const EMPTY_MAP = new Map()
const EMPTY_ARRAY: any[] = []

describe('[ makeSetTimeoutContext ]', () => {
  it('context', async () => {
    expect(makeSetTimeoutContext()).deep.eq({
      id: 0,
      time: 0,
      state: EMPTY_MAP,
      setCalls: EMPTY_ARRAY,
      clearCalls: EMPTY_ARRAY,
    })
  })
})

describe('[ makeSetIntervalContext ]', () => {
  it('context', async () => {
    expect(makeSetIntervalContext()).deep.eq({
      id: 0,
      time: 0,
      state: EMPTY_MAP,
      setCalls: EMPTY_ARRAY,
      clearCalls: EMPTY_ARRAY,
    })
  })
})

describe('[ makeSetImmediateContext ]', () => {
  it('context', async () => {
    expect(makeSetImmediateContext()).deep.eq({
      id: 0,
      state: EMPTY_MAP,
      setCalls: EMPTY_ARRAY,
      clearCalls: EMPTY_ARRAY,
    })
  })
})

describe('[ makeRequestAnimationFrameContext ]', () => {
  it('context', async () => {
    expect(makeRequestAnimationFrameContext()).deep.eq({
      id: 0,
      state: EMPTY_MAP,
      setCalls: EMPTY_ARRAY,
      clearCalls: EMPTY_ARRAY,
    })
  })
})
