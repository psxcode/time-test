import {
  RequestAnimationFrameContext,
  SetImmediateContext,
  SetIntervalContext,
  SetTimeoutContext,
} from './types'

export * from './types'

export const makeSetTimeoutContext = (): SetTimeoutContext => ({
  id: 0,
  time: 0,
  state: new Map(),
  setCalls: [],
  clearCalls: [],
})

export const makeSetIntervalContext = makeSetTimeoutContext as () => SetIntervalContext

export const makeSetImmediateContext = (): SetImmediateContext => ({
  id: 0,
  state: new Map(),
  setCalls: [],
  clearCalls: [],
})

export const makeRequestAnimationFrameContext = makeSetImmediateContext as () => RequestAnimationFrameContext

export const makeSetTimeout = (context: SetTimeoutContext) => (cb: () => any, delay: number) => {
  const id = context.id++
  const intDelay = Math.trunc(delay)
  context.state.set(id, { cb, delay: intDelay, invokeTime: context.time + intDelay })
  context.setCalls.push({ delay })

  return id
}

export const makeClearTimeout = (context: SetTimeoutContext) => (id: number) => {
  if (context.state.has(id)) {
    context.state.delete(id)
  }

  context.clearCalls.push({ id })
}

export const makeSetInterval = makeSetTimeout as (
  context: SetIntervalContext,
) => (cb: () => any, delay: number) => number

export const makeClearInterval = makeClearTimeout as (context: SetIntervalContext) => (id: number) => void

export const makeSetImmediate = (context: SetImmediateContext) => (cb: () => any) => {
  const id = context.id++
  context.state.set(id, { cb })
  context.setCalls.push({})

  return id
}

export const makeClearImmediate = (context: SetImmediateContext) => (id: number) => {
  if (context.state.has(id)) {
    context.state.delete(id)
  }

  context.clearCalls.push({ id })
}

export const makeRequestAnimationFrame = makeSetImmediate as (
  context: RequestAnimationFrameContext,
) => (cb: () => any) => number

export const makeCancelAnimationFrame = makeClearImmediate as (
  context: RequestAnimationFrameContext,
) => (id: number) => void

export const tickTimeout = (context: SetTimeoutContext) => (timeStep?: number) => {
  const entries = Array.from(context.state.entries())
    .sort(([ida, pa], [idb, pb]) => pa.invokeTime - pb.invokeTime)

  if (!entries.length) {
    return
  }

  timeStep = timeStep && isFinite(timeStep)
    ? Math.trunc(timeStep)
    : Math.max(entries[0][1].invokeTime - context.time, 0)

  context.time += timeStep

  for (let i = 0; i < entries.length; ++i) {
    const [id, p] = entries[i]
    if (p.invokeTime <= context.time) {
      context.state.delete(id)
      p.cb()
    }
  }
}

export const tickInterval = (context: SetIntervalContext) => (timeStep?: number) => {
  const entries = Array.from(context.state.entries())
    .sort(([ida, pa], [idb, pb]) => pa.invokeTime - pb.invokeTime)

  if (!entries.length) {
    return
  }

  timeStep = timeStep && isFinite(timeStep)
    ? Math.trunc(timeStep)
    : Math.max(entries[0][1].invokeTime - context.time, 0)

  context.time += timeStep

  for (let i = 0; i < entries.length; ++i) {
    const [id, p] = entries[i]
    if (p.invokeTime <= context.time) {
      p.invokeTime = p.delay + context.time
      p.cb()
    }
  }
}

export const tickImmediate = (context: SetImmediateContext) => () => {
  for (const val of context.state.values()) {
    val.cb()
  }
  context.state.clear()
}

export const tickAnimation = tickImmediate as (context: RequestAnimationFrameContext) => () => void

export const getSetTimeoutCalls = (context: SetTimeoutContext) => context.setCalls

export const getClearTimeoutCalls = (context: SetTimeoutContext) => context.clearCalls

export const getSetIntervalCalls = (context: SetIntervalContext) => context.setCalls

export const getClearIntervalCalls = (context: SetIntervalContext) => context.clearCalls

export const getSetImmediateCalls = (context: SetImmediateContext) => context.setCalls

export const getClearImmediateCalls = (context: SetImmediateContext) => context.clearCalls

export const getRequestAnimationCallsCalls = (context: RequestAnimationFrameContext) => context.setCalls

export const getCancelAnimationFrameCalls = (context: RequestAnimationFrameContext) => context.clearCalls
