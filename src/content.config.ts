import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { isDateValid } from './lib/date';

const customDate = () =>
    z
        .string()
        .regex(/^\d{4}\.\d{2}\.\d{2}$/, 'Date must be in the format YYYY.MM.DD')
        .transform(date => {
            const [year, month, day] = date.split('.').map(Number);
            const dateObject = { year, month, day };

            if (!isDateValid(dateObject)) {
                throw new Error('Invalid date');
            }

            return dateObject;
        });

const articles = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: customDate(),
        tags: z.array(z.string()),
    }),
});

export const collections = { articles };
