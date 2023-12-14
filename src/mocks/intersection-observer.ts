import { vi, type Mock } from 'vitest'

export let entries: Pick<
  IntersectionObserverEntry,
  'target' | 'isIntersecting'
>[] = []

export const resetEntries = () => (entries = [])

export let intersect: (elements: Element[]) => void

export let callbackMock: Mock

export const observeMock = vi.fn(element => {
  if (entries.some(entry => entry.target === element)) return

  const newEntry = {
    target: element,
    isIntersecting: false,
  }

  entries.push(newEntry)
  callbackMock([newEntry])
})

export const unobserveMock = vi.fn(element => {
  const i = entries.findIndex(entry => entry.target === element)

  entries.splice(i, 1)
})

export const disconnectMock = vi.fn()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const IntersectionObserverMock = vi.fn((callback, options) => {
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
