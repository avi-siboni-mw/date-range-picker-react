import React from 'react';
interface DateInputProps {
    value?: Date;
    onChange: (date: Date) => void;
    onBlur?: (validatedDate: Date) => void;
    locale?: string;
    minDate?: Date;
    maxDate?: Date;
}
declare const DateInput: React.FC<DateInputProps>;
export { DateInput };
