import { z, defineCollection } from 'astro:content';
import { isDateValid } from '~/utils/date';

const customDate = () => z.string()
    .regex(/^\d{4}\.\d{2}\.\d{2}$/, 'Date must be in the format YYYY.MM.DD')
    .transform(date => {
        const [year, month, day] = date.split('.').map(Number);

        const dateObj = { year, month, day };

        if (!isDateValid(dateObj)) {
            throw new Error('Invalid date');
        }

        return dateObj;
    });


export const collections = {
    articles: defineCollection({
        type: 'content',
        schema: z.object({
            title: z.string(),
            description: z.string(),
            date: customDate(),
            tags: z.string().array(),
        }),
    }),
};