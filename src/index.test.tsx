import React, { useState } from 'react'
import { afterEach, beforeEach, expect, test, vi, type Mock } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useIntersectionAnimation from '.'

let intersect: (elements: Element[]) => void

let entries: Pick<IntersectionObserverEntry, 'target' | 'isIntersecting'>[] = []

let callbackMock: Mock

const observeMock = vi.fn(element => {
  if (entries.some(entry => entry.target === element)) return

  const newEntry = {
    target: element,
    isIntersecting: false,
  }

  entries.push(newEntry)
  callbackMock([newEntry])
})

const unobserveMock = vi.fn(element => {
  const i = entries.findIndex(entry => entry.target === element)

  entries.splice(i, 1)
})

const disconnectMock = vi.fn()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IntersectionObserverMock = vi.fn((callback, options) => {
  callbackMock = vi.fn(entries => callback(entries))

  intersect = elements => {
    elements.forEach(element => {
      const i = entries.findIndex(entry => entry.target === element)

      if (i < 0) return

      entries[i] = {
        target: element,
        isIntersecting: true,
      }
    })

    callbackMock(entries)
  }

  return {
    observe: observeMock,
    unobserve: unobserveMock,
    disconnect: disconnectMock,
  }
})

const playMock = vi.fn()

const AnimationMock = vi.fn(effect => {
  return {
    // Creates an object with the mock's prototype to pass
    // the "instanceof" guard in code.
    effect: Object.assign(Object.create(KeyframeEffectMock.prototype), {
      ...effect,
    }),
    play: playMock,
  }
})

const updateTimingMock = vi.fn()

const KeyframeEffectMock = vi.fn(target => {
  return {
    target,
    updateTiming: updateTimingMock,
  }
})

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
  vi.stubGlobal('Animation', AnimationMock)
  vi.stubGlobal('KeyframeEffect', KeyframeEffectMock)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()

  entries = []
})

test('The animation gets played once when an intersection happens', () => {
  render(<Sandbox />)

  const elements = screen.getAllByText(/static/i)

  intersect(elements)
  expect(playMock).toHaveBeenCalledTimes(3)
  AnimationMock.mock.results.forEach(result => {
    expect(result.value.id).toBe('reveal')
  })
  expect(unobserveMock).toHaveBeenCalledTimes(3)

  playMock.mockClear()
  intersect(elements)
  expect(playMock).not.toHaveBeenCalled()
})

test('The animation gets played repeatedly if configured to do so', () => {
  render(<Sandbox options={{ repeat: true }} />)

  const elements = screen.getAllByText(/static/i)

  intersect(elements)
  expect(playMock).toHaveBeenCalledTimes(3)
  expect(unobserveMock).not.toHaveBeenCalled()

  intersect(elements)
  expect(playMock).toHaveBeenCalledTimes(6)
})

test('Animation delays are staggered correctly', () => {
  const { rerender } = render(<Sandbox />)

  const elements = screen.getAllByText(/static/i)

  intersect(elements)
  expect(updateTimingMock).toHaveBeenNthCalledWith(1, { delay: 0 })
  expect(updateTimingMock).toHaveBeenNthCalledWith(2, { delay: 100 })
  expect(updateTimingMock).toHaveBeenNthCalledWith(3, { delay: 200 })

  rerender(<Sandbox options={{ stagger: 500 }} />)

  updateTimingMock.mockClear()
  intersect(elements)
  expect(updateTimingMock).toHaveBeenNthCalledWith(1, { delay: 0 })
  expect(updateTimingMock).toHaveBeenNthCalledWith(2, { delay: 500 })
  expect(updateTimingMock).toHaveBeenNthCalledWith(3, { delay: 1000 })
})

test("A change in the component's state doesn't trigger animations to run again", async () => {
  const user = userEvent.setup()

  render(<Sandbox />)

  // If the observer didn't get re-instantiated, everything should be in place.
  expect(IntersectionObserverMock).toHaveBeenCalledOnce()
  await user.click(screen.getByRole('button', { name: /rerender/i }))
  expect(IntersectionObserverMock).toHaveBeenCalledOnce()
})

test("A change in one of the 'options' properties causes the animations to run again", () => {
  const { rerender } = render(<Sandbox />)

  // If the observer is being regenerated, the callback should be invoked,
  // animations created or played, and so on.
  expect(IntersectionObserverMock).toHaveBeenCalledTimes(1)
  rerender(<Sandbox options={{ effect: { keyframes: {}, options: {} } }} />)
  expect(IntersectionObserverMock).toHaveBeenCalledTimes(2)
  rerender(<Sandbox options={{ repeat: true }} />)
  expect(IntersectionObserverMock).toHaveBeenCalledTimes(3)
  rerender(<Sandbox options={{ stagger: 200 }} />)
  expect(IntersectionObserverMock).toHaveBeenCalledTimes(4)
  rerender(<Sandbox options={{ observerOptions: { threshold: 0.7 } }} />)
  expect(IntersectionObserverMock).toHaveBeenCalledTimes(5)
})

test("The animation's initial state is applied (to handle rootMargin < 0 or threshold > 0)", () => {
  render(<Sandbox />)

  const elements = screen.getAllByText(/static/i)

  intersect(elements)
  AnimationMock.mock.results.forEach(result => {
    expect(result.value.currentTime).toBe(0)
  })
})

test('Lazily created elements are animated without triggering a re-animation of the animated ones', async () => {
  const user = userEvent.setup()

  render(<Sandbox options={{ repeat: true }} />)

  // For now, assert the observer's default behavior of executing the callback
  // for newly observed targets, as mocking some of the functionalities
  // has proved to be tricky.
  expect(callbackMock).toHaveBeenCalledTimes(3)
  await user.click(screen.getByRole('button', { name: /toggle lazy/i }))
  expect(callbackMock).toHaveBeenCalledTimes(5)
})

test('Elements are observed (including dynamic ones)', async () => {
  const user = userEvent.setup()

  render(<Sandbox />)

  const elements = screen.getAllByText(/static/i)

  expect(entries[0].target).toBe(elements[0])
  expect(entries[1].target).toBe(elements[1])
  expect(entries[2].target).toBe(elements[2])

  expect(screen.queryAllByText(/lazy box/i)).toHaveLength(0)
  await user.click(screen.getByRole('button', { name: /toggle lazy/i }))

  const lazyElements = screen.getAllByText(/lazy box/i)

  expect(entries[3].target).toBe(lazyElements[0])
  expect(entries[4].target).toBe(lazyElements[1])
})

test('The observer options can be customized', () => {
  const defaultOptions = {
    root: undefined,
    rootMargin: undefined,
    threshold: undefined,
  }

  const customOptions = {
    root: undefined,
    rootMargin: '-100px',
    threshold: 0.5,
  }

  const { rerender } = render(<Sandbox />)

  expect(IntersectionObserverMock).toHaveBeenCalledTimes(1)
  expect(IntersectionObserverMock.mock.calls[0][1]).toEqual(defaultOptions)

  rerender(<Sandbox options={{ observerOptions: customOptions }} />)

  expect(IntersectionObserverMock).toHaveBeenCalledTimes(2)
  expect(IntersectionObserverMock.mock.calls[1][1]).toEqual(customOptions)
})

test('The observer is disconnected on unmount', () => {
  const { unmount } = render(<Sandbox />)

  expect(IntersectionObserverMock).toHaveBeenCalledOnce()
  expect(disconnectMock).not.toHaveBeenCalled()
  unmount()
  expect(disconnectMock).toHaveBeenCalledOnce()
})

test('An invalid effect causes the hook to print an error', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})

  // @ts-expect-error because we're testing an invalid effect.
  render(<Sandbox options={{ effect: [] }} />)

  expect(console.error).toHaveBeenCalledWith(
    'Invalid effect. Please provide an object with keyframes and timing options.',
  )
})

test('A warning is logged if there is no element to animate', () => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})

  render(<SandboxWithNoAnimatedElement />)

  expect(console.warn).toHaveBeenCalledWith(
    "Couldn't find an element to animate. Please provide some.",
  )
})

type Props = {
  options?: Parameters<typeof useIntersectionAnimation>[0]
}

function Sandbox(props: Props) {
  const { options = {} } = props
  const { effect, repeat, stagger, observerOptions } = options

  const [rerender, setRerender] = useState(false)
  const [lazy, setLazy] = useState(false)

  const animate = useIntersectionAnimation({
    effect,
    repeat,
    stagger,
    observerOptions,
  })

  return (
    <>
      <button onClick={() => setRerender(!rerender)}>Rerender</button>
      <button onClick={() => setLazy(!lazy)}>Toggle lazy elements</button>

      <div ref={animate}>Static box 1</div>
      <div ref={animate}>Static box 2</div>
      <div ref={animate}>Static box 3</div>

      {lazy && (
        <>
          <div ref={animate}>Lazy box 1</div>
          <div ref={animate}>Lazy box 2</div>
        </>
      )}
    </>
  )
}

function SandboxWithNoAnimatedElement() {
  useIntersectionAnimation()

  return <div />
}
