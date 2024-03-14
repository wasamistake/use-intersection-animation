import type { SyntheticEffect } from '..'

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
