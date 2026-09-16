import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { DateRangePicker } from './date-range-picker'

jest.mock('./calendar', () => {
  const React = require('react') as typeof import('react')
  return {
    Calendar: () => React.createElement('div', { 'data-testid': 'calendar-stub' })
  }
})

jest.mock('./popover', () => {
  const React = require('react') as typeof import('react')
  const { createContext, useContext, createElement, cloneElement } = React
  const PopoverContext = createContext({
    open: false,
    onOpenChange: (_open: boolean) => {}
  })

  return {
    Popover: ({
      children,
      open = false,
      onOpenChange = () => {}
    }: {
      children: React.ReactNode
      open?: boolean
      onOpenChange?: (open: boolean) => void
    }) => createElement(PopoverContext.Provider, { value: { open, onOpenChange } }, children),
    PopoverTrigger: ({ children }: { children: React.ReactElement }) => {
      const { open, onOpenChange } = useContext(PopoverContext)
      return cloneElement(children, {
        onClick: (event: React.MouseEvent) => {
          children.props.onClick?.(event)
          onOpenChange(!open)
        }
      })
    },
    PopoverContent: ({ children }: { children: React.ReactNode }) => {
      const { open } = useContext(PopoverContext)
      return open ? createElement('div', null, children) : null
    }
  }
})

const defaultRange = {
  initialDateFrom: '2023-01-01',
  initialDateTo: '2023-12-31'
}

const renderPicker = (
  props: Partial<React.ComponentProps<typeof DateRangePicker>> = {}
): ReturnType<typeof render> => {
  return render(<DateRangePicker {...defaultRange} {...props} />)
}

const openPicker = (): void => {
  fireEvent.click(screen.getByRole('button'))
}

describe('DateRangePicker', () => {
  const originalInnerWidth = window.innerWidth

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth
    })
  })

  it('renders trigger with initial range', () => {
    renderPicker()
    expect(screen.getByText(/Jan 1, 2023 - Dec 31, 2023/i)).toBeInTheDocument()
  })

  it('opens popover and renders english actions', () => {
    renderPicker()
    openPicker()
    expect(screen.getByText('Update')).toBeVisible()
    expect(screen.getByText('Cancel')).toBeVisible()
    expect(screen.getByLabelText('Compare')).toBeVisible()
  })

  it('renders portuguese translations', () => {
    renderPicker({ locale: 'pt-BR' })
    openPicker()
    expect(screen.getByText('Atualizar')).toBeVisible()
    expect(screen.getByText('Cancelar')).toBeVisible()
    expect(screen.getByLabelText('Comparar')).toBeVisible()
  })

  it('falls back to english for unsupported locale', () => {
    renderPicker({ locale: 'fr-FR' })
    openPicker()
    expect(screen.getByText('Yesterday')).toBeVisible()
    expect(screen.getByText('Update')).toBeVisible()
  })

  it('calls onUpdate when value changes', () => {
    const onUpdate = jest.fn()
    renderPicker({ onUpdate })
    openPicker()
    const monthInputs = screen.getAllByPlaceholderText('M')
    fireEvent.change(monthInputs[0], { target: { value: '2' } })
    fireEvent.blur(monthInputs[0])
    fireEvent.click(screen.getByText('Update'))
    expect(onUpdate).toHaveBeenCalled()
  })

  it('does not call onUpdate when value is unchanged', () => {
    const onUpdate = jest.fn()
    renderPicker({ onUpdate })
    openPicker()
    fireEvent.click(screen.getByText('Update'))
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('supports custom translation overrides', () => {
    renderPicker({
      translations: {
        presets: { yesterday: 'Right now' },
        actions: { update: 'Apply now', compare: 'Compare', cancel: 'Cancel' },
        labels: { selectPlaceholder: 'Select...' }
      }
    })
    openPicker()
    expect(screen.getByText('Right now')).toBeVisible()
    expect(screen.getByText('Apply now')).toBeVisible()
  })

  it('supports compare mode updates', () => {
    const onUpdate = jest.fn()
    renderPicker({ onUpdate })
    openPicker()
    fireEvent.click(screen.getByLabelText('Compare'))
    fireEvent.click(screen.getByText('Update'))
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        rangeCompare: expect.objectContaining({
          from: expect.any(Date),
          to: expect.any(Date)
        })
      })
    )
  })

  it('renders without compare control when disabled', () => {
    renderPicker({ showCompare: false })
    openPicker()
    expect(screen.queryByLabelText('Compare')).not.toBeInTheDocument()
  })

  it('applies presets', () => {
    renderPicker()
    openPicker()
    fireEvent.click(screen.getByText('Yesterday'))
    fireEvent.click(screen.getByText('Last 7 days'))
    fireEvent.click(screen.getByText('Last 30 days'))
    fireEvent.click(screen.getByText('This Month'))
    fireEvent.click(screen.getByText('Last Month'))
    expect(screen.getByText('Update')).toBeInTheDocument()
  })

  it('renders presets on the left when configured', () => {
    renderPicker({ presetPosition: 'left' })
    openPicker()
    expect(screen.getByText('Yesterday')).toBeInTheDocument()
  })

  it('renders mobile preset select on small screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500
    })
    renderPicker()
    openPicker()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })
})
