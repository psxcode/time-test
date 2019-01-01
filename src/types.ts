export type TimerPayload = {
  cb: () => any;
  delay: number;
  invokeTime: number;
}

export type CbPayload = {
  cb: () => any;
}

export type TimerCallPayload = {
  delay: number;
}

export type ClearCallPayload = {
  id: number;
}

export type CbCallPayload = {
}

export type TimerState = Map<number, TimerPayload>

export type CbState = Map<number, CbPayload>

type TimerContext = {
  id: number;
  time: number;
  state: TimerState;
  setCalls: TimerCallPayload[];
  clearCalls: ClearCallPayload[];
}

type CbContext = {
  id: number;
  state: CbState;
  setCalls: CbCallPayload[];
  clearCalls: ClearCallPayload[];
}

export type SetTimeoutContext = TimerContext & { __setTimeoutContext__?: undefined }
export type SetIntervalContext = TimerContext & { __setIntervalContext__: undefined }
export type SetImmediateContext = CbContext & { __setImmediateContext__?: undefined }
export type RequestAnimationFrameContext = CbContext & { __requestAnimationFrameContext__: undefined }

export type Entry <M extends Map<any, any>> = M extends Map<infer K, infer V> ? [K, V] : never
