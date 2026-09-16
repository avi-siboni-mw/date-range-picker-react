'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './button.js';
import { Popover, PopoverContent, PopoverTrigger } from './popover.js';
import { Calendar } from './calendar.js';
import { DateInput } from './date-input.js';
import { Label } from './label.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select.js';
import { Switch } from './switch.js';
import { ChevronUpIcon, ChevronDownIcon, CheckIcon, CalendarIcon, ArrowLeftIcon, DoubleArrowLeftIcon, TimerIcon, CounterClockwiseClockIcon } from '@radix-ui/react-icons';
import { cn } from '../lib/utils.js';
const LOCALE_TRANSLATIONS = {
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
};
// Mapeamento de ícones para cada preset
const PRESET_ICONS = {
    yesterday: ArrowLeftIcon,
    last7: DoubleArrowLeftIcon,
    last30: TimerIcon,
    thisMonth: CalendarIcon,
    lastMonth: CounterClockwiseClockIcon
};
const getTranslations = (locale = 'en-US', customTranslations) => {
    const baseTranslations = LOCALE_TRANSLATIONS[locale] || LOCALE_TRANSLATIONS['en-US'];
    return {
        presets: Object.assign(Object.assign({}, baseTranslations.presets), customTranslations === null || customTranslations === void 0 ? void 0 : customTranslations.presets),
        actions: Object.assign(Object.assign({}, baseTranslations.actions), customTranslations === null || customTranslations === void 0 ? void 0 : customTranslations.actions),
        labels: Object.assign(Object.assign({}, baseTranslations.labels), customTranslations === null || customTranslations === void 0 ? void 0 : customTranslations.labels)
    };
};
const formatDate = (date, locale = 'en-us') => {
    return date.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};
const getDateAdjustedForTimezone = (dateInput) => {
    if (typeof dateInput === 'string') {
        // Split the date string to get year, month, and day parts
        const parts = dateInput.split('-').map((part) => parseInt(part, 10));
        // Create a new Date object using the local timezone
        // Note: Month is 0-indexed, so subtract 1 from the month part
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return date;
    }
    else {
        // If dateInput is already a Date object, return it directly
        return dateInput;
    }
};
// Function to get presets with translations
const getPresets = (translations) => [
    // { name: 'today', label: translations.presets.today },
    { name: 'yesterday', label: translations.presets.yesterday },
    { name: 'last7', label: translations.presets.last7 },
    // { name: 'last14', label: translations.presets.last14 },
    { name: 'last30', label: translations.presets.last30 },
    // { name: 'thisWeek', label: translations.presets.thisWeek },
    // { name: 'lastWeek', label: translations.presets.lastWeek },
    { name: 'thisMonth', label: translations.presets.thisMonth },
    { name: 'lastMonth', label: translations.presets.lastMonth }
];
/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker = ({ initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)), initialDateTo, initialCompareFrom, initialCompareTo, onUpdate, align = 'end', locale = 'en-US', showCompare = true, translations: customTranslations, presetPosition = 'right', minDate: propMinDate, maxDate: propMaxDate }) => {
    const translations = getTranslations(locale, customTranslations);
    const PRESETS = getPresets(translations);
    // Calculate min and max dates from props or use defaults
    const { minDate, maxDate } = React.useMemo(() => {
        const now = new Date();
        // Helper to convert string/Date to Date object
        const parseDate = (date, defaultDate) => {
            if (!date)
                return defaultDate;
            return typeof date === 'string' ? new Date(date) : date;
        };
        // Default minDate: first day of current year at start of day
        const defaultMinDate = new Date(now.getFullYear(), 0, 1);
        defaultMinDate.setHours(0, 0, 0, 0);
        // Default maxDate: today at end of day
        const defaultMaxDate = new Date();
        defaultMaxDate.setHours(23, 59, 59, 999);
        // Use prop values or defaults
        const min = parseDate(propMinDate, defaultMinDate);
        const max = parseDate(propMaxDate, defaultMaxDate);
        return {
            minDate: min,
            maxDate: max
        };
    }, [propMinDate, propMaxDate]);
    const [isOpen, setIsOpen] = useState(false);
    const [range, setRange] = useState({
        from: getDateAdjustedForTimezone(initialDateFrom),
        to: initialDateTo
            ? getDateAdjustedForTimezone(initialDateTo)
            : getDateAdjustedForTimezone(initialDateFrom)
    });
    const [rangeCompare, setRangeCompare] = useState(initialCompareFrom
        ? {
            from: new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
            to: initialCompareTo
                ? new Date(new Date(initialCompareTo).setHours(0, 0, 0, 0))
                : new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0))
        }
        : undefined);
    // Refs to store the values of range and rangeCompare when the date picker is opened
    const openedRangeRef = useRef(undefined);
    const openedRangeCompareRef = useRef(undefined);
    const [selectedPreset, setSelectedPreset] = useState(undefined);
    const [isSmallScreen, setIsSmallScreen] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 1024);
        };
        window.addEventListener('resize', handleResize);
        // Clean up event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const getPresetRange = (presetName) => {
        const preset = PRESETS.find(({ name }) => name === presetName);
        if (!preset)
            throw new Error(`Unknown date range preset: ${presetName}`);
        const from = new Date();
        const to = new Date();
        const first = from.getDate() - from.getDay();
        switch (preset.name) {
            case 'today':
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
            case 'yesterday':
                from.setDate(from.getDate() - 1);
                from.setHours(0, 0, 0, 0);
                to.setDate(to.getDate() - 1);
                to.setHours(23, 59, 59, 999);
                break;
            case 'last7':
                from.setDate(from.getDate() - 6);
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
            case 'last14':
                from.setDate(from.getDate() - 13);
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
            case 'last30':
                from.setDate(from.getDate() - 29);
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
            case 'thisWeek':
                from.setDate(first);
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
            case 'lastWeek':
                from.setDate(from.getDate() - 7 - from.getDay());
                to.setDate(to.getDate() - to.getDay() - 1);
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
            case 'thisMonth':
                from.setDate(1);
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
            case 'lastMonth':
                from.setMonth(from.getMonth() - 1);
                from.setDate(1);
                from.setHours(0, 0, 0, 0);
                to.setDate(0);
                to.setHours(23, 59, 59, 999);
                break;
        }
        return { from, to };
    };
    const setPreset = (preset) => {
        const range = getPresetRange(preset);
        setRange(range);
        if (rangeCompare) {
            const rangeCompare = {
                from: new Date(range.from.getFullYear() - 1, range.from.getMonth(), range.from.getDate()),
                to: range.to
                    ? new Date(range.to.getFullYear() - 1, range.to.getMonth(), range.to.getDate())
                    : undefined
            };
            setRangeCompare(rangeCompare);
        }
    };
    const checkPreset = () => {
        var _a, _b, _c;
        for (const preset of PRESETS) {
            const presetRange = getPresetRange(preset.name);
            const normalizedRangeFrom = new Date(range.from);
            normalizedRangeFrom.setHours(0, 0, 0, 0);
            const normalizedPresetFrom = new Date(presetRange.from.setHours(0, 0, 0, 0));
            const normalizedRangeTo = new Date((_a = range.to) !== null && _a !== void 0 ? _a : 0);
            normalizedRangeTo.setHours(0, 0, 0, 0);
            const normalizedPresetTo = new Date((_c = (_b = presetRange.to) === null || _b === void 0 ? void 0 : _b.setHours(0, 0, 0, 0)) !== null && _c !== void 0 ? _c : 0);
            if (normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
                normalizedRangeTo.getTime() === normalizedPresetTo.getTime()) {
                setSelectedPreset(preset.name);
                return;
            }
        }
        setSelectedPreset(undefined);
    };
    const resetValues = () => {
        setRange({
            from: typeof initialDateFrom === 'string'
                ? getDateAdjustedForTimezone(initialDateFrom)
                : initialDateFrom,
            to: initialDateTo
                ? typeof initialDateTo === 'string'
                    ? getDateAdjustedForTimezone(initialDateTo)
                    : initialDateTo
                : typeof initialDateFrom === 'string'
                    ? getDateAdjustedForTimezone(initialDateFrom)
                    : initialDateFrom
        });
        setRangeCompare(initialCompareFrom
            ? {
                from: typeof initialCompareFrom === 'string'
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
            : undefined);
    };
    useEffect(() => {
        checkPreset();
    }, [range]);
    const PresetButton = ({ preset, label, isSelected }) => {
        const PresetIcon = PRESET_ICONS[preset] || CalendarIcon;
        return (_jsx(Button, { className: cn('transition-all duration-200 w-full justify-start', isSelected && 'bg-primary/10 border-primary font-medium', !isSelected && 'hover:bg-accent'), variant: "outline", onClick: () => {
                setPreset(preset);
            }, children: _jsxs(_Fragment, { children: [_jsx("span", { className: cn('pr-2 opacity-0 transition-opacity', isSelected && 'opacity-100'), children: _jsx(CheckIcon, { width: 18, height: 18 }) }), _jsx(PresetIcon, { width: 16, height: 16, className: "mr-2 flex-shrink-0 opacity-70" }), label] }) }));
    };
    // Helper function to check if two date ranges are equal
    const areRangesEqual = (a, b) => {
        if (!a || !b)
            return a === b; // If either is undefined, return true if both are undefined
        return (a.from.getTime() === b.from.getTime() &&
            (!a.to || !b.to || a.to.getTime() === b.to.getTime()));
    };
    useEffect(() => {
        if (isOpen) {
            openedRangeRef.current = range;
            openedRangeCompareRef.current = rangeCompare;
        }
    }, [isOpen]);
    return (_jsxs(Popover, { modal: true, open: isOpen, onOpenChange: (open) => {
            if (!open) {
                resetValues();
            }
            setIsOpen(open);
        }, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { size: 'lg', variant: "outline", children: [_jsxs("div", { className: "text-right", children: [_jsx("div", { className: "py-1", children: _jsx("div", { children: `${formatDate(range.from, locale)}${range.to != null ? ' - ' + formatDate(range.to, locale) : ''}` }) }), rangeCompare != null && (_jsx("div", { className: "opacity-60 text-xs -mt-1", children: _jsxs(_Fragment, { children: ["vs. ", formatDate(rangeCompare.from, locale), rangeCompare.to != null
                                                ? ` - ${formatDate(rangeCompare.to, locale)}`
                                                : ''] }) }))] }), _jsx("div", { className: "pl-1 opacity-60 -mr-2 scale-125", children: isOpen ? (_jsx(ChevronUpIcon, { width: 24 })) : (_jsx(ChevronDownIcon, { width: 24 })) })] }) }), _jsxs(PopoverContent, { align: align, className: "w-auto p-1 pb-1 xl:p-4 xl:pb-0 max-h-[calc(100vh-180px)] flex flex-col overflow-hidden", children: [_jsxs("div", { className: "flex pt-2 overflow-y-auto flex-1 min-h-0", children: [!isSmallScreen && presetPosition === 'left' && (_jsx("div", { className: "flex flex-col items-start gap-1 pr-6 pl-2 pb-6", children: _jsx("div", { className: "flex w-full flex-col items-start gap-1 pr-6 pl-2 pb-6", children: PRESETS.map((preset) => (_jsx(PresetButton, { preset: preset.name, label: preset.label, isSelected: selectedPreset === preset.name }, preset.name))) }) })), _jsx("div", { className: "flex", children: _jsxs("div", { className: "flex flex-col", children: [_jsxs("div", { className: "flex flex-col lg:flex-row gap-2 px-2 justify-end items-center lg:items-start pb-2 lg:pb-0", children: [showCompare && (_jsxs("div", { className: "flex items-center space-x-2 pr-4 py-1", children: [_jsx(Switch, { defaultChecked: Boolean(rangeCompare), onCheckedChange: (checked) => {
                                                                if (checked) {
                                                                    if (!range.to) {
                                                                        setRange({
                                                                            from: range.from,
                                                                            to: range.from
                                                                        });
                                                                    }
                                                                    setRangeCompare({
                                                                        from: new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate() - 365),
                                                                        to: range.to
                                                                            ? new Date(range.to.getFullYear() - 1, range.to.getMonth(), range.to.getDate())
                                                                            : new Date(range.from.getFullYear() - 1, range.from.getMonth(), range.from.getDate())
                                                                    });
                                                                }
                                                                else {
                                                                    setRangeCompare(undefined);
                                                                }
                                                            }, id: "compare-mode" }), _jsx(Label, { htmlFor: "compare-mode", children: translations.actions.compare })] })), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(DateInput, { value: range.from, onChange: (date) => {
                                                                        const toDate = range.to == null || date > range.to ? date : range.to;
                                                                        setRange((prevRange) => (Object.assign(Object.assign({}, prevRange), { from: date, to: toDate })));
                                                                    }, onBlur: (validatedDate) => {
                                                                        var _a, _b;
                                                                        // After blur validation, re-validate entire range
                                                                        let validFrom = validatedDate;
                                                                        let validTo = (_a = range.to) !== null && _a !== void 0 ? _a : validatedDate;
                                                                        // Clamp both dates to min/max boundaries
                                                                        if (minDate && validFrom < minDate)
                                                                            validFrom = minDate;
                                                                        if (maxDate && validFrom > maxDate)
                                                                            validFrom = maxDate;
                                                                        if (minDate && validTo < minDate)
                                                                            validTo = minDate;
                                                                        if (maxDate && validTo > maxDate)
                                                                            validTo = maxDate;
                                                                        // Update state if any changes occurred
                                                                        if (validFrom.getTime() !== validatedDate.getTime() || validTo.getTime() !== ((_b = range.to) !== null && _b !== void 0 ? _b : validatedDate).getTime()) {
                                                                            setRange({ from: validFrom, to: validTo });
                                                                        }
                                                                    }, locale: locale, minDate: minDate, maxDate: maxDate }), _jsx("div", { className: "py-1", children: "-" }), _jsx(DateInput, { value: range.to, onChange: (date) => {
                                                                        const fromDate = date < range.from ? date : range.from;
                                                                        setRange((prevRange) => (Object.assign(Object.assign({}, prevRange), { from: fromDate, to: date })));
                                                                    }, onBlur: (validatedDate) => {
                                                                        // After blur validation, re-validate entire range
                                                                        let validFrom = range.from;
                                                                        let validTo = validatedDate;
                                                                        // Clamp both dates to min/max boundaries
                                                                        if (minDate && validFrom < minDate)
                                                                            validFrom = minDate;
                                                                        if (maxDate && validFrom > maxDate)
                                                                            validFrom = maxDate;
                                                                        if (minDate && validTo < minDate)
                                                                            validTo = minDate;
                                                                        if (maxDate && validTo > maxDate)
                                                                            validTo = maxDate;
                                                                        // Update state if any changes occurred
                                                                        if (validFrom.getTime() !== range.from.getTime() || validTo.getTime() !== validatedDate.getTime()) {
                                                                            setRange({ from: validFrom, to: validTo });
                                                                        }
                                                                    }, locale: locale, minDate: minDate, maxDate: maxDate })] }), rangeCompare != null && (_jsxs("div", { className: "flex gap-2", children: [_jsx(DateInput, { value: rangeCompare === null || rangeCompare === void 0 ? void 0 : rangeCompare.from, onChange: (date) => {
                                                                        if (rangeCompare) {
                                                                            const compareToDate = rangeCompare.to == null || date > rangeCompare.to
                                                                                ? date
                                                                                : rangeCompare.to;
                                                                            setRangeCompare((prevRangeCompare) => (Object.assign(Object.assign({}, prevRangeCompare), { from: date, to: compareToDate })));
                                                                        }
                                                                        else {
                                                                            setRangeCompare({
                                                                                from: date,
                                                                                to: new Date()
                                                                            });
                                                                        }
                                                                    }, onBlur: (validatedDate) => {
                                                                        var _a, _b;
                                                                        if (rangeCompare) {
                                                                            // After blur validation, re-validate compare range
                                                                            let validFrom = validatedDate;
                                                                            let validTo = (_a = rangeCompare.to) !== null && _a !== void 0 ? _a : validatedDate;
                                                                            // Clamp both dates to min/max boundaries
                                                                            if (minDate && validFrom < minDate)
                                                                                validFrom = minDate;
                                                                            if (maxDate && validFrom > maxDate)
                                                                                validFrom = maxDate;
                                                                            if (minDate && validTo < minDate)
                                                                                validTo = minDate;
                                                                            if (maxDate && validTo > maxDate)
                                                                                validTo = maxDate;
                                                                            // Update state if any changes occurred
                                                                            if (validFrom.getTime() !== validatedDate.getTime() || validTo.getTime() !== ((_b = rangeCompare.to) !== null && _b !== void 0 ? _b : validatedDate).getTime()) {
                                                                                setRangeCompare({ from: validFrom, to: validTo });
                                                                            }
                                                                        }
                                                                    }, locale: locale, minDate: minDate, maxDate: maxDate }), _jsx("div", { className: "py-1", children: "-" }), _jsx(DateInput, { value: rangeCompare === null || rangeCompare === void 0 ? void 0 : rangeCompare.to, onChange: (date) => {
                                                                        if (rangeCompare && rangeCompare.from) {
                                                                            const compareFromDate = date < rangeCompare.from
                                                                                ? date
                                                                                : rangeCompare.from;
                                                                            setRangeCompare(Object.assign(Object.assign({}, rangeCompare), { from: compareFromDate, to: date }));
                                                                        }
                                                                    }, onBlur: (validatedDate) => {
                                                                        if (rangeCompare) {
                                                                            // After blur validation, re-validate compare range
                                                                            let validFrom = rangeCompare.from;
                                                                            let validTo = validatedDate;
                                                                            // Clamp both dates to min/max boundaries
                                                                            if (minDate && validFrom < minDate)
                                                                                validFrom = minDate;
                                                                            if (maxDate && validFrom > maxDate)
                                                                                validFrom = maxDate;
                                                                            if (minDate && validTo < minDate)
                                                                                validTo = minDate;
                                                                            if (maxDate && validTo > maxDate)
                                                                                validTo = maxDate;
                                                                            // Update state if any changes occurred
                                                                            if (validFrom.getTime() !== rangeCompare.from.getTime() || validTo.getTime() !== validatedDate.getTime()) {
                                                                                setRangeCompare({ from: validFrom, to: validTo });
                                                                            }
                                                                        }
                                                                    }, locale: locale, minDate: minDate, maxDate: maxDate })] }))] })] }), isSmallScreen && presetPosition !== 'none' && (_jsx("div", { className: "px-2", children: _jsxs(Select, { defaultValue: selectedPreset, onValueChange: (value) => { setPreset(value); }, children: [_jsx(SelectTrigger, { className: "w-full mb-2 border-primary/50 bg-primary/5 hover:bg-accent font-medium", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CalendarIcon, { className: "h-4 w-4 text-primary" }), _jsx(SelectValue, { placeholder: translations.labels.selectPlaceholder })] }) }), _jsx(SelectContent, { children: PRESETS.map((preset) => (_jsx(SelectItem, { value: preset.name, children: preset.label }, preset.name))) })] }) })), _jsx("div", { children: _jsx(Calendar, { mode: "range", onSelect: (value) => {
                                                    if ((value === null || value === void 0 ? void 0 : value.from) != null) {
                                                        setRange({ from: value.from, to: value === null || value === void 0 ? void 0 : value.to });
                                                    }
                                                }, selected: range, numberOfMonths: isSmallScreen ? 1 : 2, defaultMonth: new Date(new Date().setMonth(new Date().getMonth() - (isSmallScreen ? 0 : 1))), customLocale: locale, disabled: [
                                                    { before: minDate },
                                                    { after: maxDate }
                                                ] }) })] }) }), !isSmallScreen && presetPosition === 'right' && (_jsx("div", { className: "flex flex-col items-end gap-1 pr-2 pl-6 pb-6", children: _jsx("div", { className: "flex w-full flex-col items-end gap-1 pr-2 pl-6 pb-6", children: PRESETS.map((preset) => (_jsx(PresetButton, { preset: preset.name, label: preset.label, isSelected: selectedPreset === preset.name }, preset.name))) }) }))] }), _jsxs("div", { className: "flex justify-end gap-1.5 xl:gap-2 py-3 pr-4 flex-shrink-0 border-t-2 border-border shadow-sm", children: [_jsx(Button, { onClick: () => {
                                    setIsOpen(false);
                                    resetValues();
                                }, variant: "ghost", className: "rounded-md", children: translations.actions.cancel }), _jsx(Button, { onClick: () => {
                                    var _a;
                                    setIsOpen(false);
                                    if (!areRangesEqual(range, openedRangeRef.current) ||
                                        !areRangesEqual(rangeCompare, openedRangeCompareRef.current)) {
                                        // Validate and clamp dates to allowed range
                                        const clampDate = (date) => {
                                            if (!date)
                                                return date;
                                            if (date < minDate)
                                                return minDate;
                                            if (date > maxDate)
                                                return maxDate;
                                            return date;
                                        };
                                        const validFrom = (_a = clampDate(range.from)) !== null && _a !== void 0 ? _a : range.from;
                                        const validTo = clampDate(range.to);
                                        onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate({
                                            range: {
                                                from: validFrom,
                                                to: validTo
                                            },
                                            rangeCompare
                                        });
                                    }
                                }, children: translations.actions.update })] })] })] }));
};
DateRangePicker.displayName = 'DateRangePicker';
DateRangePicker.filePath =
    'libs/shared/ui-kit/src/lib/date-range-picker/date-range-picker.tsx';
