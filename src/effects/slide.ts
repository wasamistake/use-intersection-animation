import type { SyntheticEffect } from '..'

export const slideLeft: SyntheticEffect = {
  keyframes: {
    opacity: [0, 1],
    transform: ['translate3d(100px, 0, 0)', 'translate3d(0, 0, 0)'],
  },
  options: {
    duration: 800,
    easing: 'ease',
    fill: 'both',
    id: 'slide-left',
  },
}

export const slideRight: SyntheticEffect = {
  keyframes: {
    opacity: [0, 1],
    transform: ['translate3d(-100px, 0, 0)', 'translate3d(0, 0, 0)'],
  },
  options: {
    duration: 800,
    easing: 'ease',
    fill: 'both',
    id: 'slide-right',
  },
}
