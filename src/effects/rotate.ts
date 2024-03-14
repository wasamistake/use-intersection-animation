import type { SyntheticEffect } from '..'

export const rotateLeft: SyntheticEffect = {
  keyframes: {
    opacity: [0, 1],
    transform: ['rotate3d(0, 0, 1, 180deg)', 'rotate3d(0, 0, 0, 0deg)'],
  },
  options: {
    duration: 500,
    easing: 'ease',
    fill: 'both',
    id: 'rotate-left',
  },
}

export const rotateRight: SyntheticEffect = {
  keyframes: {
    opacity: [0, 1],
    transform: ['rotate3d(0, 0, 1, -180deg)', 'rotate3d(0, 0, 0, 0deg)'],
  },
  options: {
    duration: 500,
    easing: 'ease',
    fill: 'both',
    id: 'rotate-right',
  },
}
