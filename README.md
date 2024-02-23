# useIntersectionAnimation

https://github.com/wasamistake/use-intersection-animation/assets/150041252/1d453c51-0956-419f-a5cc-eff8d0c695ed

This is a React hook to animate/reveal elements when they enter the viewport (or another root element). It uses the **Intersection Observer** and the **Web Animations** APIs to achieve that, which results in a package that is small and performant.

Some built-in effects are also packaged for convenience.

## Usage

First, install the package with `npm install --save-exact @wasamistake/use-intersection-animation`. As there will probably be breaking changes before version 1, `--save-exact` will minimize the incidence of problems related to that.

Once the package has been installed, import `useIntersectionAnimation` from `@wasamistake/use-intersection-animation`.

A common use case will look something like this:

```tsx
import useIntersectionAnimation, {
  type SyntheticEffect,
} from '@wasamistake/use-intersection-animation'

const reveal: SyntheticEffect = {
  keyframes: [
    { offset: 0, opacity: 0, transform: 'translate3d(0, 100px, 0)' },
    { offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' },
  ],
  options: {
    duration: 800,
    easing: 'ease',
    fill: 'both',
    id: 'reveal',
  },
}

function Wrapper() {
  const animate = useIntersectionAnimation({
    effect: reveal,
    observerOptions: {
      rootMargin: '-100px',
    },
  })

  return (
    <>
      <div ref={animate}>Element 1</div>
      <div ref={animate}>Element 2</div>
      <div ref={animate}>Element 3</div>
    </>
  )
}
```

### Usage with SSR frameworks

If you are using a framework that relies on React Server Components, put the `'use client'` directive at the top of the file that uses this hook.

## Tracking elements

The hook returns a Ref callback to track elements. To animate an element, just pass that Ref callback to the element's `ref` prop.

```tsx
const animate = useIntersectionAnimation()

return <div ref={animate}>Element</div>
```

If the target element already has a Ref attached to it, pass the values manually, like so:

```tsx
const animate = useIntersectionAnimation()

const ref = useRef<HTMLDivElement | null>(null)

return (
  <div
    ref={instance => {
      ref.current = instance
      animate(instance)
    }}
  >
    Element
  </div>
)
```

## Creating effects

This hook animates elements via the **Web Animations API**, which accepts a **Keyframe Effect**. Keyframe Effects are objects with keyframes and timing options describing an animation.

A keyframe can be written either as an array or an object. For example, to animate the opacity of an element, one could write a keyframe like this:

```tsx
import { type SyntheticEffect } from '@wasamistake/use-intersection-animation'

const effectWithKeyframesArray: SyntheticEffect = {
  keyframes: [
    { offset: 0, opacity: 0 },
    { offset: 1, opacity: 1 },
  ],
  options: {
    duration: 1000,
    id: 'my-effect',
  },
}

// or

const effectWithKeyframesObject: SyntheticEffect = {
  keyframes: {
    opacity: [0, 1],
  },
  options: {
    duration: 1000,
    id: 'my-effect',
  },
}
```

Keyframe Effects with array syntax are much like CSS Keyframes, apart from small adaptations to make them usable with JavaScript, e.g., `{offset: 0.7, ...}` takes the place of `70% {...}` when describing the state of an element at the animation's 70% mark.

The object syntax allows one to describe simple animations in a straightforward way, while the array syntax looks more adequate (and easier) for elaborate animations.

If you are new to those concepts, searching for 'CSS Keyframes' on YouTube will wrap your head around them.

## Extending built-in effects

This package comes with some ready-to-use effects. You can import them from `@wasamistake/use-intersection-animation/effects`.

```tsx
import {
  slideLeft,
  scaleHorizontally,
  rotateRight,
  /* ... */
} from '@wasamistake/use-intersection-animation/effects'

const animate = useIntersectionAnimation({
  effect: slideLeft,
})
```

The built-in effects are written with keyframe object syntax, so they can be easily extended:

```tsx
import { reveal } from '@wasamistake/use-intersection-animation/effects'

const customReveal = {
  keyframes: {
    ...reveal.keyframes,
    transform: ['translate3d(0, 100%, 0)', 'translate3d(0, 0, 0)'],
  },
  options: {
    ...reveal.options,
    duration: 1000,
    id: 'my-reveal',
  },
}

const animate = useIntersectionAnimation({
  effect: customReveal,
})
```

## Options

Below is a list of currently available hook options.

| Name              | Description                                                                                                                   | Default value |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `effect`          | An object with keyframes and timing options describing a Web Animation. Defaults to a built-in reveal animation.              | `reveal`      |
| `repeat`          | Whether the animation should play every time the target element intersects.                                                   | `false`       |
| `stagger`         | Sets different delays (given a multiplier in milliseconds) on animations when multiple intersections happen at the same time. | `100`         |
| `observerOptions` | Options for the observer: `root`, `rootMargin`, and `threshold`.                                                              | -             |

Options marked with \* are required.

### More on the `observerOptions`

The observer options are:

- `root`: check the examples section below for more details.

- `rootMargin`: a CSS-like string describing the `margin` of the `root` element. For example: `-100px 10% -200px`, `-10vh`.

- `threshold`: how much of the element (in percentage) should be intersecting with the `root` for the animation to play. The number `0.1` means 10%, `0.3` means 30%, and so on.

You'll probably never use the `root` option, but the other ones will come very handy to trigger animations at the right moment, particularly with negative values for `rootMargin` and values greater than `0` for `threshold`.

Learn more about the `Intersection Observer API` at: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API.

## Notes

- Both the `Intersection Observer` and `Web Animations` APIs have good browser support, but if you need to deal with very old browsers, polyfills will be needed.

- Mixing `repeat: true` with `rootMargin < 0` or `threshold > 0` can produce odd results. A default behavior for that hasn't been defined yet.

## Example: Custom root element

The `root` is an element whose observed descendants will intersect with. It defaults to the browser viewport.

When using a custom `root` element, you can think of it as a mini viewport inside your page. That is, a scrollable (`overflow: auto`) element with descendants inside.

For this hook, specifically, the `root` property should be a function that returns the custom `root` element.

```tsx
function Wrapper() {
  const animate = useIntersectionAnimation({
    observerOptions: {
      root: () => document.getElementById('custom-root'),
    },
  })

  return (
    <div id='custom-root' style={{ overflow: 'auto' }}>
      <div ref={animate}>Element 1</div>
      <div ref={animate}>Element 2</div>
    </div>
  )
}
```

## Contributing

Found something out of place or have an idea? Please open an issue, and let's discuss that.

Remember to look for duplicates before ;)
