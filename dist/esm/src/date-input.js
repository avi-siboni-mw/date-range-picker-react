import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef } from 'react';
// Helper function to determine if locale uses DD/MM/YYYY format
const usesDayMonthYear = (locale) => {
    // Locales that typically use DD/MM/YYYY format
    const dayFirstLocales = ['pt-BR', 'pt-PT', 'en-GB', 'en-AU', 'fr-FR', 'de-DE', 'es-ES', 'it-IT', 'nl-NL', 'sv-SE', 'da-DK', 'nb-NO'];
    return dayFirstLocales.some(l => locale.startsWith(l.split('-')[0]) && locale !== 'en-US');
};
const DateInput = ({ value, onChange, onBlur, locale = 'en-US', minDate, maxDate }) => {
    const isDayFirst = usesDayMonthYear(locale);
    const [date, setDate] = React.useState(() => {
        const d = value ? new Date(value) : new Date();
        return {
            day: d.getDate(),
            month: d.getMonth() + 1, // JavaScript months are 0-indexed
            year: d.getFullYear()
        };
    });
    const monthRef = useRef(null);
    const dayRef = useRef(null);
    const yearRef = useRef(null);
    const isEditingRef = useRef(false);
    useEffect(() => {
        // Don't sync with parent value while user is actively editing
        if (isEditingRef.current)
            return;
        const d = value ? new Date(value) : new Date();
        setDate({
            day: d.getDate(),
            month: d.getMonth() + 1,
            year: d.getFullYear()
        });
    }, [value]);
    const validateDate = (field, value) => {
        if ((field === 'day' && (value < 1 || value > 31)) ||
            (field === 'month' && (value < 1 || value > 12)) ||
            (field === 'year' && (value < 1000 || value > 9999))) {
            return false;
        }
        // Validate the day of the month
        const newDate = Object.assign(Object.assign({}, date), { [field]: value });
        const d = new Date(newDate.year, newDate.month - 1, newDate.day);
        return d.getFullYear() === newDate.year &&
            d.getMonth() + 1 === newDate.month &&
            d.getDate() === newDate.day;
    };
    const handleInputChange = (field) => (e) => {
        // Mark that user is actively editing
        isEditingRef.current = true;
        const inputValue = e.target.value;
        // Option 2: Allow any numeric input during typing, validate only on blur
        // Accept empty input or any valid number format
        if (inputValue === '' || /^\d+$/.test(inputValue)) {
            const newValue = inputValue === '' ? 0 : Number(inputValue);
            // Update state immediately without validation
            const newDate = Object.assign(Object.assign({}, date), { [field]: newValue });
            setDate(newDate);
            // Try to create a valid date and notify parent if successful
            try {
                const tentativeDate = new Date(newDate.year, newDate.month - 1, newDate.day);
                // Fix Issue 2: Verify date wasn't auto-corrected by JavaScript (e.g., Nov 31 → Dec 1)
                const isDateCorrect = tentativeDate.getFullYear() === newDate.year &&
                    tentativeDate.getMonth() + 1 === newDate.month &&
                    tentativeDate.getDate() === newDate.day;
                // Fix Issue 3: Validate year is within reasonable range (1000-9999)
                // Prevents partial years (2, 20, 202) from corrupting date range
                const hasReasonableYear = newDate.year >= 1000 && newDate.year <= 9999;
                // Only notify parent if date is valid, not auto-corrected, AND has reasonable year
                if (!isNaN(tentativeDate.getTime()) && isDateCorrect && hasReasonableYear) {
                    onChange(tentativeDate);
                }
            }
            catch (_a) {
                // Ignore errors during intermediate states
            }
        }
    };
    const initialDate = useRef(date);
    const handleBlur = (field) => (e) => {
        // User finished editing, allow parent sync again
        isEditingRef.current = false;
        if (!e.target.value) {
            setDate(initialDate.current);
            // Notify parent when reverting to initial date
            const revertedDate = new Date(initialDate.current.year, initialDate.current.month - 1, initialDate.current.day);
            onChange(revertedDate);
            onBlur === null || onBlur === void 0 ? void 0 : onBlur(revertedDate);
            return;
        }
        const newValue = Number(e.target.value);
        const isValid = validateDate(field, newValue);
        if (!isValid) {
            setDate(initialDate.current);
            // Notify parent when reverting to initial date
            const revertedDate = new Date(initialDate.current.year, initialDate.current.month - 1, initialDate.current.day);
            onChange(revertedDate);
            onBlur === null || onBlur === void 0 ? void 0 : onBlur(revertedDate);
        }
        else {
            // If the new value is valid, update the initial value
            initialDate.current = Object.assign(Object.assign({}, date), { [field]: newValue });
            // Validate against min/max date boundaries
            const newDate = Object.assign(Object.assign({}, date), { [field]: newValue });
            const finalDate = new Date(newDate.year, newDate.month - 1, newDate.day);
            // Clamp date to valid range
            let clampedDate = finalDate;
            if (minDate && finalDate < minDate) {
                clampedDate = minDate;
            }
            else if (maxDate && finalDate > maxDate) {
                clampedDate = maxDate;
            }
            // If date was clamped, update state and notify parent
            if (clampedDate.getTime() !== finalDate.getTime()) {
                const clampedParts = {
                    day: clampedDate.getDate(),
                    month: clampedDate.getMonth() + 1,
                    year: clampedDate.getFullYear()
                };
                setDate(clampedParts);
                initialDate.current = clampedParts;
                onChange(clampedDate);
                onBlur === null || onBlur === void 0 ? void 0 : onBlur(clampedDate);
            }
            else {
                // Date was valid and not clamped
                onBlur === null || onBlur === void 0 ? void 0 : onBlur(finalDate);
            }
        }
    };
    const handleKeyDown = (field) => (e) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        // Allow command (or control) combinations
        if (e.metaKey || e.ctrlKey) {
            return;
        }
        // Prevent non-numeric characters, excluding allowed keys
        if (!/^[0-9]$/.test(e.key) &&
            ![
                'ArrowUp',
                'ArrowDown',
                'ArrowLeft',
                'ArrowRight',
                'Delete',
                'Tab',
                'Backspace',
                'Enter'
            ].includes(e.key)) {
            e.preventDefault();
            return;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            let newDate = Object.assign({}, date);
            if (field === 'day') {
                if (date[field] === new Date(date.year, date.month, 0).getDate()) {
                    newDate = Object.assign(Object.assign({}, newDate), { day: 1, month: (date.month % 12) + 1 });
                    if (newDate.month === 1)
                        newDate.year += 1;
                }
                else {
                    newDate.day += 1;
                }
            }
            if (field === 'month') {
                if (date[field] === 12) {
                    newDate = Object.assign(Object.assign({}, newDate), { month: 1, year: date.year + 1 });
                }
                else {
                    newDate.month += 1;
                }
            }
            if (field === 'year') {
                newDate.year += 1;
            }
            setDate(newDate);
            onChange(new Date(newDate.year, newDate.month - 1, newDate.day));
        }
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            let newDate = Object.assign({}, date);
            if (field === 'day') {
                if (date[field] === 1) {
                    newDate.month -= 1;
                    if (newDate.month === 0) {
                        newDate.month = 12;
                        newDate.year -= 1;
                    }
                    newDate.day = new Date(newDate.year, newDate.month, 0).getDate();
                }
                else {
                    newDate.day -= 1;
                }
            }
            if (field === 'month') {
                if (date[field] === 1) {
                    newDate = Object.assign(Object.assign({}, newDate), { month: 12, year: date.year - 1 });
                }
                else {
                    newDate.month -= 1;
                }
            }
            if (field === 'year') {
                newDate.year -= 1;
            }
            setDate(newDate);
            onChange(new Date(newDate.year, newDate.month - 1, newDate.day));
        }
        if (e.key === 'ArrowRight') {
            if (e.currentTarget.selectionStart === e.currentTarget.value.length ||
                (e.currentTarget.selectionStart === 0 &&
                    e.currentTarget.selectionEnd === e.currentTarget.value.length)) {
                e.preventDefault();
                if (isDayFirst) {
                    if (field === 'day')
                        (_a = monthRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                    if (field === 'month')
                        (_b = yearRef.current) === null || _b === void 0 ? void 0 : _b.focus();
                }
                else {
                    if (field === 'month')
                        (_c = dayRef.current) === null || _c === void 0 ? void 0 : _c.focus();
                    if (field === 'day')
                        (_d = yearRef.current) === null || _d === void 0 ? void 0 : _d.focus();
                }
            }
        }
        else if (e.key === 'ArrowLeft') {
            if (e.currentTarget.selectionStart === 0 ||
                (e.currentTarget.selectionStart === 0 &&
                    e.currentTarget.selectionEnd === e.currentTarget.value.length)) {
                e.preventDefault();
                if (isDayFirst) {
                    if (field === 'month')
                        (_e = dayRef.current) === null || _e === void 0 ? void 0 : _e.focus();
                    if (field === 'year')
                        (_f = monthRef.current) === null || _f === void 0 ? void 0 : _f.focus();
                }
                else {
                    if (field === 'day')
                        (_g = monthRef.current) === null || _g === void 0 ? void 0 : _g.focus();
                    if (field === 'year')
                        (_h = dayRef.current) === null || _h === void 0 ? void 0 : _h.focus();
                }
            }
        }
    };
    const dayInput = (_jsx("input", { type: "text", ref: dayRef, max: 31, maxLength: 2, value: date.day.toString(), onChange: handleInputChange('day'), onKeyDown: handleKeyDown('day'), onFocus: (e) => {
            if (window.innerWidth > 1024) {
                e.target.select();
            }
        }, onBlur: handleBlur('day'), className: "p-0 outline-none w-7 border-none text-center bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none", placeholder: "D" }));
    const monthInput = (_jsx("input", { type: "text", ref: monthRef, max: 12, maxLength: 2, value: date.month.toString(), onChange: handleInputChange('month'), onKeyDown: handleKeyDown('month'), onFocus: (e) => {
            if (window.innerWidth > 1024) {
                e.target.select();
            }
        }, onBlur: handleBlur('month'), className: "p-0 outline-none w-6 border-none text-center bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none", placeholder: "M" }));
    const yearInput = (_jsx("input", { type: "text", ref: yearRef, max: 9999, maxLength: 4, value: date.year.toString(), onChange: handleInputChange('year'), onKeyDown: handleKeyDown('year'), onFocus: (e) => {
            if (window.innerWidth > 1024) {
                e.target.select();
            }
        }, onBlur: handleBlur('year'), className: "p-0 outline-none w-12 border-none text-center bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none", placeholder: "YYYY" }));
    return (_jsx("div", { className: "flex border-2 border-border bg-card/50 text-foreground rounded-lg items-center text-sm px-2 py-1 shadow-sm hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-colors", children: isDayFirst
            ? (_jsxs(_Fragment, { children: [dayInput, _jsx("span", { className: "text-muted-foreground/70 text-xs font-medium -mx-px", children: "/" }), monthInput, _jsx("span", { className: "text-muted-foreground/70 text-xs font-medium -mx-px", children: "/" }), yearInput] }))
            : (_jsxs(_Fragment, { children: [monthInput, _jsx("span", { className: "text-muted-foreground/70 text-xs font-medium -mx-px", children: "/" }), dayInput, _jsx("span", { className: "text-muted-foreground/70 text-xs font-medium -mx-px", children: "/" }), yearInput] })) }));
};
DateInput.displayName = 'DateInput';
export { DateInput };
