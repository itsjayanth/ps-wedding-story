import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.ts'],
  theme: {
    extend: {
      colors: {
        ivory: 'rgb(var(--ivory) / <alpha-value>)',
        sandstone: 'rgb(var(--sandstone) / <alpha-value>)',
        gold: 'rgb(var(--gold) / <alpha-value>)',
        'gold-light': 'rgb(var(--gold-light) / <alpha-value>)',
        'gold-deep': 'rgb(var(--gold-deep) / <alpha-value>)',
        bronze: 'rgb(var(--bronze) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['var(--font-display)', 'Georgia', 'serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        script: ['var(--font-script)', 'cursive'],
        sans: ['var(--font-jost)', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: { calm: 'cubic-bezier(0.22, 0.61, 0.36, 1)' },
    },
  },
  plugins: [],
};
export default config;
