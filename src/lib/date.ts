export type DateObject = {
    year: number;
    month: number;
    day: number;
};

export const isDateValid = ({ year, month, day }: DateObject) => {
    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

export const toJsDate = (value: DateObject | string) => {
    if (typeof value === 'string') {
        const [year, month, day] = value.split('.').map(Number);
        return new Date(year, month - 1, day);
    }

    return new Date(value.year, value.month - 1, value.day);
};

export const formatDate = ({ year, month, day }: DateObject) =>
    [day, month, year].map(value => String(value).padStart(2, '0')).join('.');

export const compareDates = (left: DateObject, right: DateObject) =>
    toJsDate(left).getTime() - toJsDate(right).getTime();
