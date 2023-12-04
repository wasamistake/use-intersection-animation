import React, { useCallback, useEffect, useRef } from 'react'
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
   * Native options for an observer: `root`, `rootMargin`, and `threshold`.
   */
  observerOptions?: IntersectionObserverInit
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

  const addElement: React.RefCallback<Element> = node => {
    if (!(node instanceof Element) || elements.current.includes(node)) return

    elements.current = [...elements.current, node]
  }

  const observer = useRef<IntersectionObserver | null>(null)
  const unobserved = useRef<Element[]>([])

  const animate = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (!isSyntheticEffect(effect)) {
        console.error(
          'Invalid effect. Please provide an object with keyframes and timing options.',
        )
        return
      }

      const { keyframes, options } = effect

      const animations = entries.map(entry => {
        const animation = new Animation(
          new KeyframeEffect(entry.target, keyframes, options),
        )

        animation.id = options.id ?? ''

        // Immediately applies the animation's initial state ('fill')
        // to handle rootMargin < 0 and threshold > 0.
        animation.currentTime = 0

        return animation
      })

      const intersectingEntries = entries.filter(entry => entry.isIntersecting)

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
    [effect, repeat, stagger],
  )

  // Syncs the element list with the DOM.
  useEffect(() => {
    elements.current = elements.current.filter(element =>
      document.contains(element),
    )
  })

  // Regenerates the observer to reflect updated values
  // for 'animate', 'observerOptions', etc.
  useEffect(() => {
    observer.current = new IntersectionObserver(animate, {
      root,
      rootMargin,
      threshold,
    })

    if (!repeat) {
      // Re-observes all elements because they are being ignored
      // as a result of 'repeat=false'.
      elements.current.forEach(element => observer.current?.observe(element))
    }

    return () => observer.current?.disconnect()
  }, [animate, repeat, root, rootMargin, threshold])

  // Observes elements on every render. This may be rewritten if
  // requirements change or some related performance issue arises.
  useEffect(() => {
    if (elements.current.length === 0) {
      console.warn("Couldn't find an element to animate. Please provide some.")
      return
    }

    elements.current.forEach(element => {
      // Ignores elements that are unobserved because 'repeat=false'.
      // Otherwise, this functionality would break when
      // the parent's state changed.
      if (!repeat && unobserved.current.includes(element)) return

      observer.current?.observe(element)
    })
  })

  return addElement
}
