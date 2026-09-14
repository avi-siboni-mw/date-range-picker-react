import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './select'

describe('Select', () => {
  it('renders and selects option', () => {
    render(
      <Select defaultValue="one">
        <SelectTrigger aria-label="Pick one">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">One</SelectItem>
          <SelectItem value="two">Two</SelectItem>
        </SelectContent>
      </Select>
    )
    fireEvent.click(screen.getByRole('combobox', { name: 'Pick one' }))
    fireEvent.click(screen.getByText('Two'))
    expect(screen.getByRole('combobox', { name: 'Pick one' })).toHaveTextContent('Two')
  })
})
