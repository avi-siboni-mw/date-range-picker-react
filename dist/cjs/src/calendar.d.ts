import * as React from 'react';
import { DayPicker } from 'react-day-picker';
export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
    customLocale?: string;
};
declare function Calendar({ className, classNames, showOutsideDays, customLocale, ...restProps }: CalendarProps): React.JSX.Element;
declare namespace Calendar {
    var displayName: string;
}
export { Calendar };
