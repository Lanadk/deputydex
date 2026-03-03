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
                /* Core */
                background: 'var(--background)',
                foreground: 'var(--foreground)',

                /* Surfaces */
                surface: {
                    1: 'var(--surface-1)',
                    2: 'var(--surface-2)',
                    3: 'var(--surface-3)',
                },

                /* Accents */
                accent: {
                    DEFAULT: 'var(--accent)',
                    warm:    'var(--accent-warm)',
                    danger:  'var(--accent-danger)',
                },

                /* Typography */
                title: {
                    DEFAULT:   'var(--title-accent)',
                    subtitle:  'var(--subtitle-accent)',
                    highlight: 'var(--highlight)',
                },

                /* Card */
                card: {
                    DEFAULT:  'var(--bg-card)',
                    surface1: 'var(--card-surface-1)',
                    surface2: 'var(--card-surface-2)',
                },
                muted: 'var(--text-muted)',

                /* Borders */
                border: {
                    main:   'var(--border-main)',
                    header: 'var(--border-header)',
                    accent: {
                        1: 'var(--border-accent-1)',
                        2: 'var(--border-accent-2)',
                        3: 'var(--border-accent-3)',
                    },
                },

                /* Nameplate */
                plate: {
                    1: 'var(--plate-1)',
                    2: 'var(--plate-2)',
                    3: 'var(--plate-3)',
                },

                /* Field */
                field: 'var(--field-surface)',

                /* Span */
                clickable: 'var(--span-clickable)',
            },

            borderColor: {
                DEFAULT: 'var(--border-main)',
            },

            outlineColor: {
                focus: 'var(--toggle-focus)',
            },
        },
    },
    plugins: [],
}

export default config