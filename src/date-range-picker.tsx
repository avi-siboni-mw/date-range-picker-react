'use client'

import React, { type FC, useState, useEffect, useRef } from 'react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Calendar } from './calendar'
import { DateInput } from './date-input'
import { Label } from './label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './select'
import { Switch } from './switch'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon,
  CalendarIcon,
  ArrowLeftIcon,
  DoubleArrowLeftIcon,
  TimerIcon,
  CounterClockwiseClockIcon
} from '@radix-ui/react-icons'
import { cn } from '../lib/utils'

interface TranslationObject {
  presets: {
    today: string
    yesterday: string
    last7: string
    last14: string
    last30: string
    thisWeek: string
    lastWeek: string
    thisMonth: string
    lastMonth: string
  }
  actions: {
    update: string
    compare: string
    cancel: string
  }
  labels: {
    selectPlaceholder: string
  }
}

const LOCALE_TRANSLATIONS: Record<string, TranslationObject> = {
  'en-US': {
    presets: {
      today: 'Today',
      yesterday: 'Yesterday',
      last7: 'Last 7 days',
      last14: 'Last 14 days',
      last30: 'Last 30 days',
      thisWeek: 'This Week',
      lastWeek: 'Last Week',
      thisMonth: 'This Month',
      lastMonth: 'Last Month'
    },
    actions: {
      update: 'Update',
      compare: 'Compare',
      cancel: 'Cancel'
    },
    labels: {
      selectPlaceholder: 'Select...'
    }
  },
  'pt-BR': {
    presets: {
      today: 'Hoje',
      yesterday: 'Ontem',
      last7: 'Últimos 7 dias',
      last14: 'Últimos 14 dias',
      last30: 'Últimos 30 dias',
      thisWeek: 'Esta Semana',
      lastWeek: 'Semana Passada',
      thisMonth: 'Este Mês',
      lastMonth: 'Mês Passado'
    },
    actions: {
      update: 'Atualizar',
      compare: 'Comparar',
      cancel: 'Cancelar'
    },
    labels: {
      selectPlaceholder: 'Selecionar...'
    }
  },
  pt: {
    presets: {
      today: 'Hoje',
      yesterday: 'Ontem',
      last7: 'Últimos 7 dias',
      last14: 'Últimos 14 dias',
      last30: 'Últimos 30 dias',
      thisWeek: 'Esta Semana',
      lastWeek: 'Semana Passada',
      thisMonth: 'Este Mês',
      lastMonth: 'Mês Passado'
    },
    actions: {
      update: 'Actualizar',
      compare: 'Comparar',
      cancel: 'Cancelar'
    },
    labels: {
      selectPlaceholder: 'Seleccionar...'
    }
  },
  'es-ES': {
    presets: {
      today: 'Hoy',
      yesterday: 'Ayer',
      last7: 'Últimos 7 días',
      last14: 'Últimos 14 días',
      last30: 'Últimos 30 días',
      thisWeek: 'Esta Semana',
      lastWeek: 'Semana Pasada',
      thisMonth: 'Este Mes',
      lastMonth: 'Mes Pasado'
    },
    actions: {
      update: 'Actualizar',
      compare: 'Comparar',
      cancel: 'Cancelar'
    },
    labels: {
      selectPlaceholder: 'Seleccionar...'
    }
  }
}

// Mapeamento de ícones para cada preset
const PRESET_ICONS: Record<string, React.ComponentType<{ width?: number; height?: number; className?: string }>> = {
  yesterday: ArrowLeftIcon,
  last7: DoubleArrowLeftIcon,
  last30: TimerIcon,
  thisMonth: CalendarIcon,
  lastMonth: CounterClockwiseClockIcon
}

const getTranslations = (locale: string = 'en-US', customTranslations?: Partial<TranslationObject>): TranslationObject => {
  const baseTranslations = LOCALE_TRANSLATIONS[locale] || LOCALE_TRANSLATIONS['en-US']

  return {
    presets: { ...baseTranslations.presets, ...customTranslations?.presets },
    actions: { ...baseTranslations.actions, ...customTranslations?.actions },
    labels: { ...baseTranslations.labels, ...customTranslations?.labels }
  }
}

export interface DateRangePickerProps {
  /** Click handler for applying the updates from DateRangePicker. */
  onUpdate?: (values: { range: DateRange, rangeCompare?: DateRange }) => void
  /** Initial value for start date */
  initialDateFrom?: Date | string
  /** Initial value for end date */
  initialDateTo?: Date | string
  /** Initial value for start date for compare */
  initialCompareFrom?: Date | string
  /** Initial value for end date for compare */
  initialCompareTo?: Date | string
  /** Alignment of popover */
  align?: 'start' | 'center' | 'end'
  /** Option for locale */
  locale?: string
  /** Option for showing compare feature */
  showCompare?: boolean
  /** Custom translations to override default locale-based translations */
  translations?: Partial<TranslationObject>
  /** Position of preset buttons: 'left', 'right', or 'none' */
  presetPosition?: 'left' | 'right' | 'none'
  /** Minimum selectable date (defaults to first day of current year) */
  minDate?: Date | string
  /** Maximum selectable date (defaults to today) */
  maxDate?: Date | string
}

const formatDate = (date: Date, locale: string = 'en-us'): string => {
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
  if (typeof dateInput === 'string') {
    // Split the date string to get year, month, and day parts
    const parts = dateInput.split('-').map((part) => parseInt(part, 10))
    // Create a new Date object using the local timezone
    // Note: Month is 0-indexed, so subtract 1 from the month part
    const date = new Date(parts[0], parts[1] - 1, parts[2])
    return date
  } else {
    // If dateInput is already a Date object, return it directly
    return dateInput
  }
}

interface DateRange {
  from: Date
  to: Date | undefined
}

interface Preset {
  name: string
  label: string
}

// Function to get presets with translations
const getPresets = (translations: TranslationObject): Preset[] => [
  // { name: 'today', label: translations.presets.today },
  { name: 'yesterday', label: translations.presets.yesterday },
  { name: 'last7', label: translations.presets.last7 },
  // { name: 'last14', label: translations.presets.last14 },
  { name: 'last30', label: translations.presets.last30 },
  // { name: 'thisWeek', label: translations.presets.thisWeek },
  // { name: 'lastWeek', label: translations.presets.lastWeek },
  { name: 'thisMonth', label: translations.presets.thisMonth },
  { name: 'lastMonth', label: translations.presets.lastMonth }
]

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker: FC<DateRangePickerProps> & {
  filePath: string
} = ({
  initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
  initialDateTo,
  initialCompareFrom,
  initialCompareTo,
  onUpdate,
  align = 'end',
  locale = 'en-US',
  showCompare = true,
  translations: customTranslations,
  presetPosition = 'right',
  minDate: propMinDate,
  maxDate: propMaxDate
}): React.JSX.Element => {
  const translations = getTranslations(locale, customTranslations)
  const PRESETS = getPresets(translations)

  // Calculate min and max dates from props or use defaults
  const { minDate, maxDate } = React.useMemo(() => {
    const now = new Date()

    // Helper to convert string/Date to Date object
    const parseDate = (date: Date | string | undefined, defaultDate: Date): Date => {
      if (!date) return defaultDate
      return typeof date === 'string' ? new Date(date) : date
    }

    // Default minDate: first day of current year at start of day
    const defaultMinDate = new Date(now.getFullYear(), 0, 1)
    defaultMinDate.setHours(0, 0, 0, 0)

    // Default maxDate: today at end of day
    const defaultMaxDate = new Date()
    defaultMaxDate.setHours(23, 59, 59, 999)

    // Use prop values or defaults
    const min = parseDate(propMinDate, defaultMinDate)
    const max = parseDate(propMaxDate, defaultMaxDate)

    return {
      minDate: min,
      maxDate: max
    }
  }, [propMinDate, propMaxDate])

  const [isOpen, setIsOpen] = useState(false)

  const [range, setRange] = useState<DateRange>({
    from: getDateAdjustedForTimezone(initialDateFrom),
    to: initialDateTo
      ? getDateAdjustedForTimezone(initialDateTo)
      : getDateAdjustedForTimezone(initialDateFrom)
  })
  const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
    initialCompareFrom
      ? {
          from: new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
          to: initialCompareTo
            ? new Date(new Date(initialCompareTo).setHours(0, 0, 0, 0))
            : new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0))
        }
      : undefined
  )

  // Refs to store the values of range and rangeCompare when the date picker is opened
  const openedRangeRef = useRef<DateRange | undefined>(undefined)
  const openedRangeCompareRef = useRef<DateRange | undefined>(undefined)

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined)

  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  )

  useEffect(() => {
    const handleResize = (): void => {
      setIsSmallScreen(window.innerWidth < 1024)
    }

    window.addEventListener('resize', handleResize)

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getPresetRange = (presetName: string): DateRange => {
    const preset = PRESETS.find(({ name }) => name === presetName)
    if (!preset) throw new Error(`Unknown date range preset: ${presetName}`)
    const from = new Date()
    const to = new Date()
    const first = from.getDate() - from.getDay()

    switch (preset.name) {
      case 'today':
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case 'yesterday':
        from.setDate(from.getDate() - 1)
        from.setHours(0, 0, 0, 0)
        to.setDate(to.getDate() - 1)
        to.setHours(23, 59, 59, 999)
        break
      case 'last7':
        from.setDate(from.getDate() - 6)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case 'last14':
        from.setDate(from.getDate() - 13)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case 'last30':
        from.setDate(from.getDate() - 29)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case 'thisWeek':
        from.setDate(first)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case 'lastWeek':
        from.setDate(from.getDate() - 7 - from.getDay())
        to.setDate(to.getDate() - to.getDay() - 1)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case 'thisMonth':
        from.setDate(1)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case 'lastMonth':
        from.setMonth(from.getMonth() - 1)
        from.setDate(1)
        from.setHours(0, 0, 0, 0)
        to.setDate(0)
        to.setHours(23, 59, 59, 999)
        break
    }

    return { from, to }
  }

  const setPreset = (preset: string): void => {
    const range = getPresetRange(preset)
    setRange(range)
    if (rangeCompare) {
      const rangeCompare = {
        from: new Date(
          range.from.getFullYear() - 1,
          range.from.getMonth(),
          range.from.getDate()
        ),
        to: range.to
          ? new Date(
            range.to.getFullYear() - 1,
            range.to.getMonth(),
            range.to.getDate()
          )
          : undefined
      }
      setRangeCompare(rangeCompare)
    }
  }

  const checkPreset = (): void => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name)

      const normalizedRangeFrom = new Date(range.from)
      normalizedRangeFrom.setHours(0, 0, 0, 0)
      const normalizedPresetFrom = new Date(
        presetRange.from.setHours(0, 0, 0, 0)
      )

      const normalizedRangeTo = new Date(range.to ?? 0)
      normalizedRangeTo.setHours(0, 0, 0, 0)
      const normalizedPresetTo = new Date(
        presetRange.to?.setHours(0, 0, 0, 0) ?? 0
      )

      if (
        normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
        normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
      ) {
        setSelectedPreset(preset.name)
        return
      }
    }

    setSelectedPreset(undefined)
  }

  const resetValues = (): void => {
    setRange({
      from:
        typeof initialDateFrom === 'string'
          ? getDateAdjustedForTimezone(initialDateFrom)
          : initialDateFrom,
      to: initialDateTo
        ? typeof initialDateTo === 'string'
          ? getDateAdjustedForTimezone(initialDateTo)
          : initialDateTo
        : typeof initialDateFrom === 'string'
          ? getDateAdjustedForTimezone(initialDateFrom)
          : initialDateFrom
    })
    setRangeCompare(
      initialCompareFrom
        ? {
            from:
              typeof initialCompareFrom === 'string'
                ? getDateAdjustedForTimezone(initialCompareFrom)
                : initialCompareFrom,
            to: initialCompareTo
              ? typeof initialCompareTo === 'string'
                ? getDateAdjustedForTimezone(initialCompareTo)
                : initialCompareTo
              : typeof initialCompareFrom === 'string'
                ? getDateAdjustedForTimezone(initialCompareFrom)
                : initialCompareFrom
          }
        : undefined
    )
  }

  useEffect(() => {
    checkPreset()
  }, [range])

  const PresetButton = ({
    preset,
    label,
    isSelected
  }: {
    preset: string
    label: string
    isSelected: boolean
  }): React.JSX.Element => {
    const PresetIcon = PRESET_ICONS[preset] || CalendarIcon

    return (
      <Button
        className={cn(
          'transition-all duration-200 w-full justify-start',
          isSelected && 'bg-primary/10 border-primary font-medium',
          !isSelected && 'hover:bg-accent'
        )}
        variant="outline"
        onClick={() => {
          setPreset(preset)
        }}
      >
        <>
          <span className={cn('pr-2 opacity-0 transition-opacity', isSelected && 'opacity-100')}>
            <CheckIcon width={18} height={18} />
          </span>
          <PresetIcon width={16} height={16} className="mr-2 flex-shrink-0 opacity-70" />
          {label}
        </>
      </Button>
    )
  }

  // Helper function to check if two date ranges are equal
  const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
    if (!a || !b) return a === b // If either is undefined, return true if both are undefined
    return (
      a.from.getTime() === b.from.getTime() &&
      (!a.to || !b.to || a.to.getTime() === b.to.getTime())
    )
  }

  useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = range
      openedRangeCompareRef.current = rangeCompare
    }
  }, [isOpen])

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          resetValues()
        }
        setIsOpen(open)
      }}
    >
      <PopoverTrigger asChild>
        <Button size={'lg'} variant="outline">
          <div className="text-right">
            <div className="py-1">
              <div>{`${formatDate(range.from, locale)}${
                range.to != null ? ' - ' + formatDate(range.to, locale) : ''
              }`}</div>
            </div>
            {rangeCompare != null && (
              <div className="opacity-60 text-xs -mt-1">
                <>
                  vs. {formatDate(rangeCompare.from, locale)}
                  {rangeCompare.to != null
                    ? ` - ${formatDate(rangeCompare.to, locale)}`
                    : ''}
                </>
              </div>
            )}
          </div>
          <div className="pl-1 opacity-60 -mr-2 scale-125">
            {isOpen ? (<ChevronUpIcon width={24} />) : (<ChevronDownIcon width={24} />)}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto p-1 pb-1 xl:p-4 xl:pb-0 max-h-[calc(100vh-180px)] flex flex-col overflow-hidden">
        <div className="flex pt-2 overflow-y-auto flex-1 min-h-0">
          {!isSmallScreen && presetPosition === 'left' && (
            <div className="flex flex-col items-start gap-1 pr-6 pl-2 pb-6">
              <div className="flex w-full flex-col items-start gap-1 pr-6 pl-2 pb-6">
                {PRESETS.map((preset) => (
                  <PresetButton
                    key={preset.name}
                    preset={preset.name}
                    label={preset.label}
                    isSelected={selectedPreset === preset.name}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="flex">
            <div className="flex flex-col">
              <div className="flex flex-col lg:flex-row gap-2 px-2 justify-end items-center lg:items-start pb-2 lg:pb-0">
                {showCompare && (
                  <div className="flex items-center space-x-2 pr-4 py-1">
                    <Switch
                      defaultChecked={Boolean(rangeCompare)}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          if (!range.to) {
                            setRange({
                              from: range.from,
                              to: range.from
                            })
                          }
                          setRangeCompare({
                            from: new Date(
                              range.from.getFullYear(),
                              range.from.getMonth(),
                              range.from.getDate() - 365
                            ),
                            to: range.to
                              ? new Date(
                                range.to.getFullYear() - 1,
                                range.to.getMonth(),
                                range.to.getDate()
                              )
                              : new Date(
                                range.from.getFullYear() - 1,
                                range.from.getMonth(),
                                range.from.getDate()
                              )
                          })
                        } else {
                          setRangeCompare(undefined)
                        }
                      }}
                      id="compare-mode"
                    />
                    <Label htmlFor="compare-mode">{translations.actions.compare}</Label>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <DateInput
                      value={range.from}
                      onChange={(date) => {
                        const toDate =
                          range.to == null || date > range.to ? date : range.to
                        setRange((prevRange) => ({
                          ...prevRange,
                          from: date,
                          to: toDate
                        }))
                      }}
                      onBlur={(validatedDate) => {
                        // After blur validation, re-validate entire range
                        let validFrom = validatedDate
                        let validTo = range.to ?? validatedDate

                        // Clamp both dates to min/max boundaries
                        if (minDate && validFrom < minDate) validFrom = minDate
                        if (maxDate && validFrom > maxDate) validFrom = maxDate
                        if (minDate && validTo < minDate) validTo = minDate
                        if (maxDate && validTo > maxDate) validTo = maxDate

                        // Update state if any changes occurred
                        if (validFrom.getTime() !== validatedDate.getTime() || validTo.getTime() !== (range.to ?? validatedDate).getTime()) {
                          setRange({ from: validFrom, to: validTo })
                        }
                      }}
                      locale={locale}
                      minDate={minDate}
                      maxDate={maxDate}
                    />
                    <div className="py-1">-</div>
                    <DateInput
                      value={range.to}
                      onChange={(date) => {
                        const fromDate = date < range.from ? date : range.from
                        setRange((prevRange) => ({
                          ...prevRange,
                          from: fromDate,
                          to: date
                        }))
                      }}
                      onBlur={(validatedDate) => {
                        // After blur validation, re-validate entire range
                        let validFrom = range.from
                        let validTo = validatedDate

                        // Clamp both dates to min/max boundaries
                        if (minDate && validFrom < minDate) validFrom = minDate
                        if (maxDate && validFrom > maxDate) validFrom = maxDate
                        if (minDate && validTo < minDate) validTo = minDate
                        if (maxDate && validTo > maxDate) validTo = maxDate

                        // Update state if any changes occurred
                        if (validFrom.getTime() !== range.from.getTime() || validTo.getTime() !== validatedDate.getTime()) {
                          setRange({ from: validFrom, to: validTo })
                        }
                      }}
                      locale={locale}
                      minDate={minDate}
                      maxDate={maxDate}
                    />
                  </div>
                  {rangeCompare != null && (
                    <div className="flex gap-2">
                      <DateInput
                        value={rangeCompare?.from}
                        onChange={(date) => {
                          if (rangeCompare) {
                            const compareToDate =
                              rangeCompare.to == null || date > rangeCompare.to
                                ? date
                                : rangeCompare.to
                            setRangeCompare((prevRangeCompare) => ({
                              ...prevRangeCompare,
                              from: date,
                              to: compareToDate
                            }))
                          } else {
                            setRangeCompare({
                              from: date,
                              to: new Date()
                            })
                          }
                        }}
                        onBlur={(validatedDate) => {
                          if (rangeCompare) {
                            // After blur validation, re-validate compare range
                            let validFrom = validatedDate
                            let validTo = rangeCompare.to ?? validatedDate

                            // Clamp both dates to min/max boundaries
                            if (minDate && validFrom < minDate) validFrom = minDate
                            if (maxDate && validFrom > maxDate) validFrom = maxDate
                            if (minDate && validTo < minDate) validTo = minDate
                            if (maxDate && validTo > maxDate) validTo = maxDate

                            // Update state if any changes occurred
                            if (validFrom.getTime() !== validatedDate.getTime() || validTo.getTime() !== (rangeCompare.to ?? validatedDate).getTime()) {
                              setRangeCompare({ from: validFrom, to: validTo })
                            }
                          }
                        }}
                        locale={locale}
                        minDate={minDate}
                        maxDate={maxDate}
                      />
                      <div className="py-1">-</div>
                      <DateInput
                        value={rangeCompare?.to}
                        onChange={(date) => {
                          if (rangeCompare && rangeCompare.from) {
                            const compareFromDate =
                              date < rangeCompare.from
                                ? date
                                : rangeCompare.from
                            setRangeCompare({
                              ...rangeCompare,
                              from: compareFromDate,
                              to: date
                            })
                          }
                        }}
                        onBlur={(validatedDate) => {
                          if (rangeCompare) {
                            // After blur validation, re-validate compare range
                            let validFrom = rangeCompare.from
                            let validTo = validatedDate

                            // Clamp both dates to min/max boundaries
                            if (minDate && validFrom < minDate) validFrom = minDate
                            if (maxDate && validFrom > maxDate) validFrom = maxDate
                            if (minDate && validTo < minDate) validTo = minDate
                            if (maxDate && validTo > maxDate) validTo = maxDate

                            // Update state if any changes occurred
                            if (validFrom.getTime() !== rangeCompare.from.getTime() || validTo.getTime() !== validatedDate.getTime()) {
                              setRangeCompare({ from: validFrom, to: validTo })
                            }
                          }
                        }}
                        locale={locale}
                        minDate={minDate}
                        maxDate={maxDate}
                      />
                    </div>
                  )}
                </div>
              </div>
              { isSmallScreen && presetPosition !== 'none' && (
                <div className="px-2">
                  <Select defaultValue={selectedPreset} onValueChange={(value) => { setPreset(value) }}>
                    <SelectTrigger className="w-full mb-2 border-primary/50 bg-primary/5 hover:bg-accent font-medium">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <SelectValue placeholder={translations.labels.selectPlaceholder} />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {PRESETS.map((preset) => (
                        <SelectItem key={preset.name} value={preset.name}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Calendar
                  mode="range"
                  onSelect={(value: { from?: Date, to?: Date } | undefined) => {
                    if (value?.from != null) {
                      setRange({ from: value.from, to: value?.to })
                    }
                  }}
                  selected={range}
                  numberOfMonths={isSmallScreen ? 1 : 2}
                  defaultMonth={
                    new Date(
                      new Date().setMonth(
                        new Date().getMonth() - (isSmallScreen ? 0 : 1)
                      )
                    )
                  }
                  customLocale={locale}
                  disabled={[
                    { before: minDate },
                    { after: maxDate }
                  ]}
                />
              </div>
            </div>
          </div>
          {!isSmallScreen && presetPosition === 'right' && (
            <div className="flex flex-col items-end gap-1 pr-2 pl-6 pb-6">
              <div className="flex w-full flex-col items-end gap-1 pr-2 pl-6 pb-6">
                {PRESETS.map((preset) => (
                  <PresetButton
                    key={preset.name}
                    preset={preset.name}
                    label={preset.label}
                    isSelected={selectedPreset === preset.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-1.5 xl:gap-2 py-3 pr-4 flex-shrink-0 border-t-2 border-border shadow-sm">
          <Button
            onClick={() => {
              setIsOpen(false)
              resetValues()
            }}
            variant="ghost"
            className="rounded-md"
          >
            {translations.actions.cancel}
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false)
              if (
                !areRangesEqual(range, openedRangeRef.current) ||
                !areRangesEqual(rangeCompare, openedRangeCompareRef.current)
              ) {
                // Validate and clamp dates to allowed range
                const clampDate = (date: Date | undefined): Date | undefined => {
                  if (!date) return date
                  if (date < minDate) return minDate
                  if (date > maxDate) return maxDate
                  return date
                }

                const validFrom = clampDate(range.from) ?? range.from
                const validTo = clampDate(range.to)

                onUpdate?.({
                  range: {
                    from: validFrom,
                    to: validTo
                  },
                  rangeCompare
                })
              }
            }}
          >
            {translations.actions.update}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

DateRangePicker.displayName = 'DateRangePicker'
DateRangePicker.filePath =
  'libs/shared/ui-kit/src/lib/date-range-picker/date-range-picker.tsx'
