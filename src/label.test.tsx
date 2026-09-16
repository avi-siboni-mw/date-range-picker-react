import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Label } from './label'

describe('Label', () => {
  it('renders label text', () => {
    render(<Label htmlFor="x">My Label</Label>)
    expect(screen.getByText('My Label')).toBeInTheDocument()
  })
})
