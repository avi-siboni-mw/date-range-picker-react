import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import timezoneMock from 'timezone-mock'
import { DateRangePicker } from './date-range-picker'

describe('DateRangePicker', () => {
  beforeEach(() => {
    timezoneMock.register('UTC')
  })

  afterEach(() => {
    timezoneMock.unregister()
  })

  it('renders trigger with initial range', () => {
    render(<DateRangePicker initialDateFrom="2023-01-01" initialDateTo="2023-12-31" />)
    expect(screen.getByRole('button', { name: /Jan 1, 2023 - Dec 31, 2023/i })).toBeInTheDocument()
  })

  it('opens popover and renders english actions', () => {
    render(<DateRangePicker initialDateFrom="2023-01-01" initialDateTo="2023-12-31" />)
    fireEvent.click(screen.getByRole('button', { name: /Jan 1, 2023 - Dec 31, 2023/i }))
    expect(screen.getByRole('button', { name: /Update/i })).toBeVisible()
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeVisible()
    expect(screen.getByRole('switch', { name: /Compare/i })).toBeVisible()
  })

  it('renders portuguese translations', () => {
    render(
      <DateRangePicker locale="pt-BR" initialDateFrom="2023-01-01" initialDateTo="2023-12-31" />
    )
    fireEvent.click(screen.getByRole('button', { name: /2023/i }))
    expect(screen.getByRole('button', { name: /Atualizar/i })).toBeVisible()
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeVisible()
    expect(screen.getByRole('switch', { name: /Comparar/i })).toBeVisible()
  })

  it('falls back to english for unsupported locale', () => {
    render(
      <DateRangePicker locale="fr-FR" initialDateFrom="2023-01-01" initialDateTo="2023-12-31" />
    )
    fireEvent.click(screen.getByRole('button', { name: /2023/i }))
    expect(screen.getByRole('button', { name: /Yesterday/i })).toBeVisible()
    expect(screen.getByRole('button', { name: /Update/i })).toBeVisible()
  })

  it('calls onUpdate when value changes', async () => {
    const onUpdate = jest.fn()
    render(
      <DateRangePicker
        initialDateFrom="2023-01-01"
        initialDateTo="2023-12-31"
        onUpdate={onUpdate}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Jan 1, 2023 - Dec 31, 2023/i }))
    const monthInputs = screen.getAllByPlaceholderText('M')
    fireEvent.change(monthInputs[0], { target: { value: '2' } })
    fireEvent.blur(monthInputs[0])
    fireEvent.click(screen.getByRole('button', { name: /Update/i }))

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled()
    })
  })

  it('does not call onUpdate when value is unchanged', () => {
    const onUpdate = jest.fn()
    render(
      <DateRangePicker
        initialDateFrom="2023-01-01"
        initialDateTo="2023-12-31"
        onUpdate={onUpdate}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Jan 1, 2023 - Dec 31, 2023/i }))
    fireEvent.click(screen.getByRole('button', { name: /Update/i }))
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('supports custom translation overrides', () => {
    render(
      <DateRangePicker
        initialDateFrom="2023-01-01"
        initialDateTo="2023-12-31"
        translations={{
          presets: { yesterday: 'Right now' },
          actions: { update: 'Apply now', compare: 'Compare', cancel: 'Cancel' },
          labels: { selectPlaceholder: 'Select...' }
        }}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Jan 1, 2023 - Dec 31, 2023/i }))
    expect(screen.getByRole('button', { name: /Right now/i })).toBeVisible()
    expect(screen.getByRole('button', { name: /Apply now/i })).toBeVisible()
  })

  it('supports compare mode updates', async () => {
    const onUpdate = jest.fn()
    render(
      <DateRangePicker
        initialDateFrom="2023-01-01"
        initialDateTo="2023-12-31"
        onUpdate={onUpdate}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Jan 1, 2023 - Dec 31, 2023/i }))
    fireEvent.click(screen.getByRole('switch', { name: /Compare/i }))
    fireEvent.click(screen.getByRole('button', { name: /Update/i }))

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          rangeCompare: expect.objectContaining({
            from: expect.any(Date),
            to: expect.any(Date)
          })
        })
      )
    })
  })

  it('renders without compare control when disabled', () => {
    render(
      <DateRangePicker
        initialDateFrom="2023-01-01"
        initialDateTo="2023-12-31"
        showCompare={false}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Jan 1, 2023 - Dec 31, 2023/i }))
    expect(screen.queryByRole('switch', { name: /Compare/i })).not.toBeInTheDocument()
  })

  it('applies presets', () => {
    render(<DateRangePicker initialDateFrom="2023-01-01" initialDateTo="2023-12-31" />)
    fireEvent.click(screen.getByRole('button', { name: /Jan 1, 2023 - Dec 31, 2023/i }))
    fireEvent.click(screen.getByRole('button', { name: /Yesterday/i }))
    fireEvent.click(screen.getByRole('button', { name: /Last 7 days/i }))
    fireEvent.click(screen.getByRole('button', { name: /Last 30 days/i }))
    fireEvent.click(screen.getByRole('button', { name: /This Month/i }))
    fireEvent.click(screen.getByRole('button', { name: /Last Month/i }))
    expect(screen.getByRole('button', { name: /Update/i })).toBeInTheDocument()
  })

  it('renders presets on the left when configured', () => {
    render(
      <DateRangePicker
        initialDateFrom="2023-01-01"
        initialDateTo="2023-12-31"
        presetPosition="left"
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Jan 1, 2023 - Dec 31, 2023/i }))
    expect(screen.getByRole('button', { name: /Yesterday/i })).toBeInTheDocument()
  })

  it('renders mobile preset select on small screens', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 })
    window.dispatchEvent(new Event('resize'))
    render(<DateRangePicker initialDateFrom="2023-01-01" initialDateTo="2023-12-31" />)
    fireEvent.click(screen.getByRole('button', { name: /Jan 1, 2023 - Dec 31, 2023/i }))
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
    window.dispatchEvent(new Event('resize'))
  })
})
