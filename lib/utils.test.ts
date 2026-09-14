import { cn } from './utils'

describe('cn', () => {
  it('merges class names and resolves tailwind conflicts', () => {
    expect(cn('p-2', 'text-sm', 'p-4')).toBe('text-sm p-4')
  })
})
