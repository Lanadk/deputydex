import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './app/component-library/**/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',

                surface: {
                    1: 'var(--surface-1)',
                    2: 'var(--surface-2)',
                    3: 'var(--surface-3)',
                },

                accent: {
                    DEFAULT: 'var(--accent)',
                    warm: 'var(--accent-warm)',
                    danger: 'var(--accent-danger)',
                },

                title: {
                    DEFAULT: 'var(--title-accent)',
                    subtitle: 'var(--subtitle-accent)',
                    highlight: 'var(--highlight)',
                }
            }
        }
    },
    plugins: [],
}
export default config;