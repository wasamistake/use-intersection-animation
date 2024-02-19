import React, { useEffect, useRef } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { reveal } from './effects'
import { isSyntheticEffect } from './utils'

export type SyntheticEffect = {
  keyframes: Keyframe[] | PropertyIndexedKeyframes
  options: KeyframeAnimationOptions
}

type Options = {
  /**
   * An object with keyframes and timing options describing a Web Animation.
   * Defaults to a built-in reveal animation.
   */
  effect?: SyntheticEffect
  /**
   * Whether the animation should play every time
   * the target element intersects.
   * @default false
   */
  repeat?: boolean
  /**
   * Sets different delays (given a multiplier in milliseconds) on animations
   * when multiple intersections happen at the same time.
   * @default 100
   */
  stagger?: number
  /**
   * Options for the observer: `root`, `rootMargin`, and `threshold`.
   */
  observerOptions?: Omit<IntersectionObserverInit, 'root'> & {
    root?: () => IntersectionObserverInit['root']
  }
}

/**
 * Animate elements when they intersect with the viewport
 * (or another root element).
 */
export default function useIntersectionAnimation(options: Options = {}) {
  const {
    effect = reveal,
    repeat = false,
    stagger = 100,
    observerOptions = {},
  } = options

  const { root, rootMargin, threshold } = observerOptions

  const elements = useRef<Element[]>([])

  const addElement: React.RefCallback<Element> = element => {
    if (!(element instanceof Element) || elements.current.includes(element)) {
      return
    }

    elements.current = [...elements.current, element]
  }

  const observer = useRef<IntersectionObserver | null>(null)
  const unobserved = useRef<Element[]>([])

  // Syncs the element list with the DOM.
  useEffect(() => {
    elements.current = elements.current.filter(element =>
      document.contains(element),
    )
  })

  // Observes and animates elements when the appropriate dependencies change.
  // useDeepCompareEffect is used to handle dependencies that might have a
  // new reference on every render, e.g., effect.
  useDeepCompareEffect(() => {
    if (!isSyntheticEffect(effect)) {
      console.error(
        'Invalid effect. Please provide an object with keyframes and timing options.',
      )
      return
    }

    observer.current = new IntersectionObserver(
      entries => {
        const { keyframes, options } = effect

        const animations = entries.map(entry => {
          const animation = new Animation(
            new KeyframeEffect(entry.target, keyframes, options),
          )

          animation.id = options.id ?? ''

          // Immediately applies the animation's initial state to handle
          // rootMargin < 0 and threshold > 0.
          animation.currentTime = 0

          return animation
        })

        const intersectingEntries = entries.filter(
          entry => entry.isIntersecting,
        )

        intersectingEntries.forEach((entry, i) => {
          const originalDelay = options.delay ?? 0
          const delay = originalDelay + stagger * i

          const animation = animations.find(animation => {
            if (animation.effect instanceof KeyframeEffect) {
              return animation.effect.target === entry.target
            }
          })

          if (animation) {
            animation.effect?.updateTiming({ delay })

            animation.play()
          }

          if (!repeat) {
            observer.current?.unobserve(entry.target)
            unobserved.current.push(entry.target)
          }
        })
      },
      { root: root?.(), rootMargin, threshold },
    )

    if (!repeat) {
      // Re-observes all elements that were eventually unobserved as a result of
      // repeat=false, so they are reanimated when the dependencies change.
      elements.current.forEach(element => observer.current?.observe(element))
    }

    return () => observer.current?.disconnect()
  }, [effect, repeat, stagger, root, rootMargin, threshold])

  // Observes elements on every render. This may be rewritten if requirements
  // change or some related performance issue arises.
  useEffect(() => {
    if (elements.current.length === 0) {
      console.warn("Couldn't find an element to animate. Please provide some.")
      return
    }

    elements.current.forEach(element => {
      // Ignores elements that are unobserved because repeat=false.
      // Otherwise, they would be reanimated on parent's state change.
      if (!repeat && unobserved.current.includes(element)) return

      observer.current?.observe(element)
    })
  })

  return addElement
}
