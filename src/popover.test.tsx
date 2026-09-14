import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

describe('Popover', () => {
  it('shows content when trigger is clicked', () => {
    render(
      <Popover>
        <PopoverTrigger asChild>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
