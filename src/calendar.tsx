'use client'

import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { buttonVariants } from './button'

interface CalendarLocale {
  weekdayNames: string[]
  monthNames: string[]
}

const CALENDAR_LOCALES: Record<string, CalendarLocale> = {
  'en-US': {
    weekdayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  },
  'pt-BR': {
    weekdayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  }
}

const getCalendarLocale = (locale: string = 'en-US'): CalendarLocale => {
  return CALENDAR_LOCALES[locale] || CALENDAR_LOCALES['en-US']
}

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  customLocale?: string
}

function Calendar ({
  className,
  classNames,
  showOutsideDays = true,
  customLocale = 'en-US',
  ...restProps
}: CalendarProps): JSX.Element {
  const calendarLocale = getCalendarLocale(customLocale)
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-2 xl:p-3', className)}
      formatters={{
        formatCaption: (date) => `${calendarLocale.monthNames[date.getMonth()]} ${date.getFullYear()}`,
        formatWeekdayName: (date) => calendarLocale.weekdayNames[date.getDay()].substring(0, 2)
      }}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-base font-semibold',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-8 w-8 bg-transparent p-0 opacity-80 hover:opacity-100 hover:bg-accent transition-all'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-7 xl:w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2 rounded-lg overflow-hidden',
        cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-primary/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-7 w-7 xl:h-8 xl:w-8 p-0 font-normal aria-selected:opacity-100'
        ),
        day_selected:
          'bg-primary hover:bg-primary/90 focus:bg-primary/90 text-primary-foreground',
        day_today: 'font-semibold',
        day_outside: 'text-muted-foreground opacity-40 invisible',
        day_disabled: 'text-muted-foreground opacity-30 line-through bg-muted/30',
        day_range_middle:
          'aria-selected:bg-primary/20 aria-selected:text-foreground aria-selected:font-medium rounded-none border-t border-b border-primary/20',
        day_range_start:
          'bg-primary hover:bg-primary/90 focus:bg-primary/90 text-primary-foreground rounded-l-md',
        day_range_end:
          'bg-primary hover:bg-primary/90 focus:bg-primary/90 text-primary-foreground rounded-r-md',
        day_hidden: 'invisible',
        ...classNames
      }}
      components={{
        IconLeft: (props) => <ChevronLeftIcon {...props} className={cn('h-5 w-5', props.className)} />,
        IconRight: (props) => <ChevronRightIcon {...props} className={cn('h-5 w-5', props.className)} />
      }}
      {...restProps}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
