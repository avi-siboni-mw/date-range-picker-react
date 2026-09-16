import { type FC } from 'react';
interface TranslationObject {
    presets: {
        today: string;
        yesterday: string;
        last7: string;
        last14: string;
        last30: string;
        thisWeek: string;
        lastWeek: string;
        thisMonth: string;
        lastMonth: string;
    };
    actions: {
        update: string;
        compare: string;
        cancel: string;
    };
    labels: {
        selectPlaceholder: string;
    };
}
export interface DateRangePickerProps {
    /** Click handler for applying the updates from DateRangePicker. */
    onUpdate?: (values: {
        range: DateRange;
        rangeCompare?: DateRange;
    }) => void;
    /** Initial value for start date */
    initialDateFrom?: Date | string;
    /** Initial value for end date */
    initialDateTo?: Date | string;
    /** Initial value for start date for compare */
    initialCompareFrom?: Date | string;
    /** Initial value for end date for compare */
    initialCompareTo?: Date | string;
    /** Alignment of popover */
    align?: 'start' | 'center' | 'end';
    /** Option for locale */
    locale?: string;
    /** Option for showing compare feature */
    showCompare?: boolean;
    /** Custom translations to override default locale-based translations */
    translations?: Partial<TranslationObject>;
    /** Position of preset buttons: 'left', 'right', or 'none' */
    presetPosition?: 'left' | 'right' | 'none';
    /** Minimum selectable date (defaults to first day of current year) */
    minDate?: Date | string;
    /** Maximum selectable date (defaults to today) */
    maxDate?: Date | string;
}
interface DateRange {
    from: Date;
    to: Date | undefined;
}
/** The DateRangePicker component allows a user to select a range of dates */
export declare const DateRangePicker: FC<DateRangePickerProps> & {
    filePath: string;
};
export {};
