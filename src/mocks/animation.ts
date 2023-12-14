import { vi } from 'vitest'
import { KeyframeEffectMock } from './keyframe-effect'

export const playMock = vi.fn()

export const AnimationMock = vi.fn(effect => {
  return {
    // Creates an object with the mock's prototype to pass
    // the "instanceof" guard in code.
    effect: Object.assign(Object.create(KeyframeEffectMock.prototype), {
      ...effect,
    }),
    play: playMock,
  }
})
