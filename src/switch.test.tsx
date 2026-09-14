import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { Switch } from './switch'

describe('Switch', () => {
  it('toggles checked state', () => {
    render(<Switch aria-label="Toggle value" />)
    const control = screen.getByRole('switch', { name: 'Toggle value' })
    expect(control).toHaveAttribute('data-state', 'unchecked')
    fireEvent.click(control)
    expect(control).toHaveAttribute('data-state', 'checked')
  })
})
