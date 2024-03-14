import type { SyntheticEffect } from '..'

export const reveal: SyntheticEffect = {
  keyframes: {
    opacity: [0, 1],
    transform: ['translate3d(0, 100px, 0)', 'translate3d(0, 0, 0)'],
  },
  options: {
    duration: 800,
    easing: 'ease',
    fill: 'both',
    id: 'reveal',
  },
}
