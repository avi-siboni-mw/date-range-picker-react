# `date-range-picker-react` 

Enhanced DateRangePicker component built for [Shadcn](https://ui.shadcn.com/) using [Radix UI](https://www.radix-ui.com/) and [Tailwind CSS](https://tailwindcss.com/). 

## ✨ Enhanced Features

- **🌍 Portuguese Localization**: Complete pt-BR translation support
- **📅 DD/MM/YYYY Format**: Automatic date format based on locale
- **🎨 Improved Styling**: Better visual feedback and primary color integration
- **📍 Flexible Preset Positioning**: Configure presets on left, right, or hide them completely
- **🎯 Enhanced UX**: Improved switch visibility, hover states, and button styling

## Installation

Install via npm:

```bash
npm install date-range-picker-react
```

The package expects your app to provide React and ReactDOM, and it is designed to be used in projects that already have Tailwind CSS and shadcn-compatible styling set up.

## Usage

Import the published component directly from the package:

```jsx
import { DateRangePicker } from 'date-range-picker-react'
```

## Docs Website (Live Example)

This repository includes a docs site with an interactive playground in `/docs`.

- Run locally: `npm run docs:dev`
- Build static docs: `npm run docs:build`
- Preview build: `npm run docs:preview`

GitHub Pages deployment is automated with `.github/workflows/docs.yml`.

All runtime dependencies used by the component, including Radix UI primitives, are installed automatically with the package.


## Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `onUpdate` | function | - | Callback function that is called when the date range is updated. The function receives an object containing the selected date range and, if the compare feature is enabled, the compare date range. |
| `initialDateFrom` | Date or string | Today’s Date | The initial start date for the main date range. |
| `initialDateTo` | Date or string | - | The initial end date for the main date range. |
| `initialCompareFrom` | Date or string | - | The initial start date for the compare date range. |
| `initialCompareTo` | Date or string | - | The initial end date for the compare date range. |
| `align` | string | `'end'` | The alignment of the dropdown popover. Options are `'start'`, `'center'`, or `'end'`. |
| `locale` | string | `'en-US'` | The locale used for date formatting and UI text language. Supported locales: `'en-US'`, `'pt-BR'`. |
| `showCompare` | boolean | `true` | Whether to show the compare date range feature. |
| `presetPosition` | string | `'right'` | Position of preset buttons: `'left'`, `'right'`, or `'none'`. |
| `translations` | object | - | Custom translations to override default locale-based UI text. Allows partial overrides. |

## Examples

### Basic Usage

```jsx
import { DateRangePicker } from 'date-range-picker-react'

<DateRangePicker
  onUpdate={(values) => console.log(values)}
  initialDateFrom="2023-01-01"
  initialDateTo="2023-12-31"
  align="start"
  locale="pt-BR"
  showCompare={false}
  presetPosition="left"
/>
```

### Enhanced Usage Examples

```jsx
// Portuguese localization with DD/MM/YYYY format
<DateRangePicker
  locale="pt-BR"
  onUpdate={(values) => console.log(values)}
/>

// Preset buttons on the left
<DateRangePicker
  presetPosition="left"
  onUpdate={(values) => console.log(values)}
/>

// Hide preset buttons entirely
<DateRangePicker
  presetPosition="none"
  onUpdate={(values) => console.log(values)}
/>
```

### Internationalization

The component supports automatic UI translation based on the `locale` prop:

```jsx
// Portuguese Brazilian UI
<DateRangePicker
  locale="pt-BR"
  onUpdate={(values) => console.log(values)}
/>
```

### Custom Translations

You can override specific UI text using the `translations` prop:

```jsx
// Portuguese with custom overrides
<DateRangePicker
  locale="pt-BR"
  translations={{
    presets: { today: 'Hoje mesmo' },
    actions: { update: 'Aplicar' }
  }}
  onUpdate={(values) => console.log(values)}
/>

// Custom English translations
<DateRangePicker
  translations={{
    presets: { 
      today: 'Right Now',
      last7: 'Past Week' 
    },
    actions: { 
      update: 'Apply Changes',
      cancel: 'Discard' 
    }
  }}
  onUpdate={(values) => console.log(values)}
/>
```

### Translation Object Structure

```typescript
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
```
