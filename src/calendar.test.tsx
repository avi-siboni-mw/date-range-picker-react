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
})
