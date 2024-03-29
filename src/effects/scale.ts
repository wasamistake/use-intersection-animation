import type { SyntheticEffect } from '..'

export const scale: SyntheticEffect = {
  keyframes: {
    opacity: [0, 1],
    transform: ['scale3d(0, 0, 0)', 'scale3d(1, 1, 1)'],
  },
  options: {
    duration: 500,
    easing: 'ease',
    fill: 'both',
    id: 'scale',
  },
}

export const scaleHorizontally: SyntheticEffect = {
  keyframes: {
    opacity: [0, 1],
    transform: ['scale3d(0, 1, 1)', 'scale3d(1, 1, 1)'],
  },
  options: {
    duration: 500,
    easing: 'ease',
    fill: 'both',
    id: 'scale-horizontally',
  },
}

export const scaleVertically: SyntheticEffect = {
  keyframes: {
    opacity: [0, 1],
    transform: ['scale3d(1, 0, 1)', 'scale3d(1, 1, 1)'],
  },
  options: {
    duration: 500,
    easing: 'ease',
    fill: 'both',
    id: 'scale-vertically',
  },
}
