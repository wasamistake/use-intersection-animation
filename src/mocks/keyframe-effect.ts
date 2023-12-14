import { vi } from 'vitest'

export const updateTimingMock = vi.fn()

export const KeyframeEffectMock = vi.fn(target => {
  return {
    target,
    updateTiming: updateTimingMock,
  }
})
