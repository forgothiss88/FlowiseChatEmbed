import { JSX } from 'solid-js/jsx-runtime';

export const Spinner = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    {...props}
    class={'twi-animate-spin twi-ml-1 twi-mr-3 twi-h-5 twi-w-5 ' + props.class}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    data-testid="loading-spinner"
  >
    <circle class="twi-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
    <path
      class="twi-opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
