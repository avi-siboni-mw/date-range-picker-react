import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Calendar } from './calendar'

describe('Calendar', () => {
  it('renders with english locale labels', () => {
    render(<Calendar customLocale="en-US" mode="single" defaultMonth={new Date('2023-01-01')} />)
    expect(screen.getAllByText('Su')[0]).toBeInTheDocument()
  })

  it('falls back to english for unsupported locale', () => {
    render(<Calendar customLocale="fr-FR" mode="single" defaultMonth={new Date('2023-01-01')} />)
    expect(screen.getAllByText('Su')[0]).toBeInTheDocument()
  })

  it('renders custom chevrons for navigation and dropdowns', () => {
    const { container } = render(
      <Calendar
        customLocale="en-US"
        mode="single"
        defaultMonth={new Date('2023-01-01')}
        captionLayout="dropdown"
        fromYear={2020}
        toYear={2025}
      />
    )

    expect(container.querySelector('svg[data-orientation="left"]')).toBeInTheDocument()
    expect(container.querySelector('svg[data-orientation="right"]')).toBeInTheDocument()
    expect(container.querySelector('svg[data-orientation="down"]')).toBeInTheDocument()
  })
})
