import { useMemo, useState } from 'react'
import { DateRangePicker } from '../../src'

type PickerValues = {
  range: {
    from: Date
    to?: Date
  }
  rangeCompare?: {
    from: Date
    to?: Date
  }
}

function formatValue(value?: PickerValues) {
  if (!value) {
    return 'No selection yet.'
  }

  const output = {
    range: {
      from: value.range.from.toISOString().slice(0, 10),
      to: value.range.to ? value.range.to.toISOString().slice(0, 10) : null
    },
    rangeCompare: value.rangeCompare
      ? {
          from: value.rangeCompare.from.toISOString().slice(0, 10),
          to: value.rangeCompare.to ? value.rangeCompare.to.toISOString().slice(0, 10) : null
        }
      : null
  }

  return JSON.stringify(output, null, 2)
}

function App() {
  const [locale, setLocale] = useState('en-US')
  const [showCompare, setShowCompare] = useState(true)
  const [presetPosition, setPresetPosition] = useState<'left' | 'right' | 'none'>('right')
  const [align, setAlign] = useState<'start' | 'center' | 'end'>('end')
  const [latestValue, setLatestValue] = useState<PickerValues>()

  const output = useMemo(() => formatValue(latestValue), [latestValue])

  return (
    <main className="page">
      <header>
        <h1>@woli/date-range-picker</h1>
        <p>Interactive documentation with a live DateRangePicker example.</p>
      </header>

      <section className="card">
        <h2>Playground</h2>

        <div className="controls">
          <label>
            Locale
            <select value={locale} onChange={(event) => setLocale(event.target.value)}>
              <option value="en-US">English (en-US)</option>
              <option value="pt-BR">Português (pt-BR)</option>
              <option value="es-ES">Español (es-ES)</option>
            </select>
          </label>

          <label>
            Presets
            <select
              value={presetPosition}
              onChange={(event) => setPresetPosition(event.target.value as 'left' | 'right' | 'none')}
            >
              <option value="right">Right</option>
              <option value="left">Left</option>
              <option value="none">Hidden</option>
            </select>
          </label>

          <label>
            Popover align
            <select value={align} onChange={(event) => setAlign(event.target.value as 'start' | 'center' | 'end')}>
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
            </select>
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={showCompare}
              onChange={(event) => setShowCompare(event.target.checked)}
            />
            Enable compare
          </label>
        </div>

        <div className="demo">
          <DateRangePicker
            align={align}
            locale={locale}
            presetPosition={presetPosition}
            showCompare={showCompare}
            onUpdate={(values) => setLatestValue(values as PickerValues)}
          />
        </div>

        <h3>onUpdate output</h3>
        <pre>{output}</pre>
      </section>

      <section className="card">
        <h2>Use locally</h2>
        <pre>npm install @woli/date-range-picker</pre>
      </section>
    </main>
  )
}

export default App
