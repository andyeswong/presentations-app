import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: 'inherit',
                        a: {
                            color: theme('colors.amber.500'),
                            '&:hover': {
                                color: theme('colors.amber.600'),
                            },
                        },
                        'h1, h2, h3, h4, h5, h6': {
                            color: 'inherit',
                        },
                        code: {
                            color: 'inherit',
                            backgroundColor: theme('colors.gray.100'),
                            borderRadius: theme('borderRadius.md'),
                            paddingTop: theme('padding.1'),
                            paddingRight: theme('padding.2'),
                            paddingBottom: theme('padding.1'),
                            paddingLeft: theme('padding.2'),
                        },
                        'code::before': {
                            content: '""',
                        },
                        'code::after': {
                            content: '""',
                        },
                        pre: {
                            backgroundColor: theme('colors.gray.900'),
                            color: theme('colors.gray.100'),
                        },
                    },
                },
            }),
        },
    },

    plugins: [forms, typography],
};
