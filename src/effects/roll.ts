import type { SyntheticEffect } from '..'

export const rollLeft: SyntheticEffect = {
  keyframes: {
    opacity: [0, 1],
    transform: [
      'translate3d(200%, 0, 0) rotate3d(0, 0, 1, 320deg)',
      'translate3d(0, 0, 0) rotate3d(0, 0, 1, 0deg)',
    ],
  },
  options: {
    duration: 800,
    easing: 'ease',
    fill: 'both',
    id: 'roll-left',
  },
}

export const rollRight: SyntheticEffect = {
  keyframes: {
    opacity: [0, 1],
    transform: [
      'translate3d(-200%, 0, 0) rotate3d(0, 0, 1, -320deg)',
      'translate3d(0, 0, 0) rotate3d(0, 0, 1, 0deg)',
    ],
  },
  options: {
    duration: 800,
    easing: 'ease',
    fill: 'both',
    id: 'roll-right',
  },
}
