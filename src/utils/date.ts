export type DateObject = {
    year: number;
    month: number;
    day: number;
};

export const isDateValid = ({ year, month, day }: DateObject) => {
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

export const toJsDate = (obj: DateObject | string) => {
    if (typeof obj === 'string') {
        const [year, month, day] = obj.split('.').map(Number);
        return new Date(year, month - 1, day);
    }

    return new Date(obj.year, obj.month - 1, obj.day);
};

export const formatDate = ({ year, month, day }: DateObject) => {
    return [
        day,
        month,
        year,
    ]
        .map(x => String(x).padStart(2, '0'))
        .join('.');
};

export const compareDates = (a: DateObject, b: DateObject) => {
    return new Date(a.year, a.month - 1, a.day).getTime() - new Date(b.year, b.month - 1, b.day).getTime();
};
