import type { SyntheticEffect } from '.'

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
