// eslint-disable-next-line @typescript-eslint/no-var-requires
import defaultTheme from 'tailwindcss/defaultTheme';

function rem2px(input, fontSize = 16) {
  if (input == null) {
    return input;
  }
  switch (typeof input) {
    case 'object':
      if (Array.isArray(input)) {
        return input.map((val) => rem2px(val, fontSize));
      }
      // eslint-disable-next-line no-case-declarations
      const ret = {};
      for (const key in input) {
        ret[key] = rem2px(input[key], fontSize);
      }
      return ret;
    case 'string':
      return input.replace(/(\d*\.?\d+)rem$/, (_, val) => `${parseFloat(val) * fontSize}px`);
    case 'function':
      return eval(input.toString().replace(/(\d*\.?\d+)rem/g, (_, val) => `${parseFloat(val) * fontSize}px`));
    default:
      return input;
  }
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  important: '.twini-base',
  prefix: 'twi-',
  theme: {
    ...rem2px(defaultTheme),
    extend: {
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
      colors: {
        'brand-dark': 'rgb(var(--brand-secondary))',
        'brand-light': 'rgb(var(--brand-primary))',
        'brand-primary': 'rgb(var(--brand-primary))',
        'brand-secondary': 'rgb(var(--brand-secondary))',
        'brand-action-primary': 'rgb(var(--brand-action-primary))',
        'brand-action-secondary': 'rgb(var(--brand-action-secondary))',
        'brand-gradient': 'var(--brand-gradient)',
        'brand-gradient-reversed': 'var(--brand-gradient-reversed)',
      },
      textColor: {
        'brand-primary': 'rgb(var(--brand-primary-text-color))',
        'brand-secondary': 'rgb(var(--brand-secondary-text-color))',
        'brand-action-primary': 'rgb(var(--brand-action-primary-text-color))',
        'brand-action-secondary': 'rgb(var(--brand-action-secondary-text-color))',
      },
      gradientColorStops: {
        brand: 'var(--brand-gradient)',
        'brand-reversed': 'var(--brand-gradient-reversed)',
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
      borderRadius: {
        '4xl': '32px',
      },
    },
  },
};
