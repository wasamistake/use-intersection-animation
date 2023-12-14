import React, { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import useIntersectionAnimation from '.'
import * as exportedEffects from './effects'
import './index.stories.css'

const meta: Meta = {
  title: 'useIntersectionAnimation',
}

export default meta
type Story = StoryObj

export const Sandbox: Story = {
  render: function _() {
    const [rerender, setRerender] = useState(false)

    useEffect(() => {
      const intervalId = setInterval(() => {
        console.info(
          "Re-rendering component to check that animations don't play again.",
        )
        setRerender(!rerender)
      }, 3000)

      return () => clearInterval(intervalId)
    })

    const [lazy, setLazy] = useState(false)

    const [effect, setEffect] = useState(exportedEffects.reveal)
    const [repeat, setRepeat] = useState(false)
    const [stagger, setStagger] = useState(100)

    const [rootMargin, setRootMargin] = useState('0px')
    const [threshold, setThreshold] = useState(0)

    const animate = useIntersectionAnimation({
      effect,
      repeat,
      stagger,
      observerOptions: {
        rootMargin,
        threshold,
      },
    })

    return (
      <>
        <div className='controls'>
          <button onClick={() => setLazy(!lazy)}>Toggle lazy elements</button>

          <fieldset>
            <legend>Options</legend>

            <select
              value={
                Object.entries(exportedEffects).find(exportedEffect => {
                  return exportedEffect[1] === effect
                })?.[0]
              }
              onChange={e =>
                setEffect(
                  exportedEffects[
                    e.target.value as keyof typeof exportedEffects
                  ],
                )
              }
            >
              {Object.entries(exportedEffects).map(exportedEffect => {
                const [exportName] = exportedEffect

                return (
                  <option value={exportName} key={exportName}>
                    {exportName}
                  </option>
                )
              })}
            </select>

            <button onClick={() => setRepeat(!repeat)}>Toggle repeat</button>

            <label>
              Delay offset
              <input
                type='number'
                defaultValue={stagger}
                step={100}
                min={0}
                onChange={e => setStagger(Number(e.target.value))}
              />
            </label>
          </fieldset>

          <fieldset>
            <legend>Observer options</legend>

            <label>
              Root margin
              <input
                type='number'
                defaultValue={rootMargin.slice(0, -2)}
                step={100}
                onChange={e => {
                  if (e.target.value !== '') {
                    setRootMargin(`${e.target.value}px`)
                  }
                }}
              />
            </label>

            <label>
              Threshold
              <input
                type='number'
                defaultValue={threshold}
                step={0.1}
                min={0}
                max={1}
                onChange={e => setThreshold(Number(e.target.value))}
              />
            </label>
          </fieldset>
        </div>

        <section className='container'>
          <div className='grid'>
            <div ref={animate} className='box' />
            <div ref={animate} className='box' />
            <div ref={animate} className='box' />

            {lazy && (
              <>
                <div ref={animate} className='box box--lazy' />
                <div ref={animate} className='box box--lazy' />
              </>
            )}
          </div>
        </section>

        <section className='container'>
          <h1 ref={animate}>:P</h1>
        </section>
      </>
    )
  },
}

export const CustomRoot: Story = {
  name: 'Example: Custom Root',
  parameters: {
    layout: 'centered',
  },
  render: function _() {
    const animate = useIntersectionAnimation({
      effect: exportedEffects.slideLeft,
      repeat: true,
      observerOptions: {
        root: () => document.getElementById('custom-root'),
      },
    })

    return (
      <div id='custom-root'>
        <div ref={animate} className='box' />
        <div ref={animate} className='box' />
        <div ref={animate} className='box' />
      </div>
    )
  },
}
