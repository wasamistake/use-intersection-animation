import type { SyntheticEffect } from '.'

export const focusIn: SyntheticEffect = {
  keyframes: {
    opacity: [0, 1],
    filter: ['blur(16px)', 'blur(0)'],
  },
  options: {
    duration: 800,
    easing: 'ease',
    fill: 'both',
    id: 'focus-in',
  },
}

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
