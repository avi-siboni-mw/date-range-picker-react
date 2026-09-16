import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { DateInput } from './date-input'

describe('DateInput', () => {
  it('renders month/day/year order for en-US', () => {
    render(<DateInput value={new Date('2023-01-02')} onChange={() => {}} locale="en-US" />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).toHaveAttribute('placeholder', 'M')
    expect(inputs[1]).toHaveAttribute('placeholder', 'D')
    expect(inputs[2]).toHaveAttribute('placeholder', 'YYYY')
  })

  it('renders day/month/year order for pt-BR', () => {
    render(<DateInput value={new Date('2023-01-02')} onChange={() => {}} locale="pt-BR" />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).toHaveAttribute('placeholder', 'D')
    expect(inputs[1]).toHaveAttribute('placeholder', 'M')
    expect(inputs[2]).toHaveAttribute('placeholder', 'YYYY')
  })

  it('reverts invalid blur input to previous value', () => {
    const onChange = jest.fn()
    const onBlur = jest.fn()
    render(<DateInput value={new Date('2023-01-02')} onChange={onChange} onBlur={onBlur} />)
    const monthInput = screen.getByPlaceholderText('M')
    fireEvent.change(monthInput, { target: { value: '13' } })
    fireEvent.blur(monthInput)
    expect(monthInput).toHaveValue('1')
    expect(onBlur).toHaveBeenCalled()
  })

  it('clamps to min and max dates on blur', () => {
    const onChange = jest.fn()
    render(
      <DateInput
        value={new Date('2023-01-02')}
        onChange={onChange}
        minDate={new Date('2023-01-05')}
        maxDate={new Date('2023-01-10')}
      />
    )
    const dayInput = screen.getByPlaceholderText('D')
    fireEvent.change(dayInput, { target: { value: '1' } })
    fireEvent.blur(dayInput)
    expect(dayInput).toHaveValue('5')
  })

  it('handles keyboard navigation and numeric guards', () => {
    const onChange = jest.fn()
    render(<DateInput value={new Date('2023-01-31')} onChange={onChange} />)
    const monthInput = screen.getByPlaceholderText('M')
    const dayInput = screen.getByPlaceholderText('D')
    const yearInput = screen.getByPlaceholderText('YYYY')

    fireEvent.keyDown(monthInput, { key: 'a' })

    fireEvent.keyDown(dayInput, { key: 'ArrowUp' })
    fireEvent.keyDown(dayInput, { key: 'ArrowDown' })
    fireEvent.keyDown(monthInput, { key: 'ArrowDown' })
    fireEvent.keyDown(monthInput, { key: 'ArrowUp' })
    fireEvent.keyDown(yearInput, { key: 'ArrowUp' })
    fireEvent.keyDown(yearInput, { key: 'ArrowDown' })
    expect(onChange).toHaveBeenCalled()
  })
})
