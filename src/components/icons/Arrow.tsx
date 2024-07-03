export const LeftArrow = () => (
  <svg class={'text-gray-600 w-6 h-6'} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox={`0 0 24 24`}>
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7" />
  </svg>
);

export const RightArrow = () => (
  <svg class={'text-gray-600 w-6 h-6'} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox={`0 0 24 24`}>
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
  </svg>
);

export const UpArrow = () => (
  <svg class={'text-gray-600 w-6 h-6'} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox={`0 0 24 24`}>
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 15 7-7 7 7" />
  </svg>
);

export const DownArrow = () => (
  <svg class={'text-gray-600 w-6 h-6'} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox={`0 0 24 24`}>
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
  </svg>
);

export const Hamburger = (props: { classList?: string }) => (
  <svg
    preserveAspectRatio="xMidYMid meet"
    class={props.classList}
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    fill="none"
    viewBox={'0 0 24 24'}
  >
    <path
      fill="#000"
      fill-rule="evenodd"
      d="M20.182 3H3.818C2.814 3 2 3.895 2 5v2c0 1.105.814 2 1.818 2h16.364C21.186 9 22 8.105 22 7V5c0-1.105-.814-2-1.818-2ZM3.818 11h16.364c1.004 0 1.818.895 1.818 2v2c0 1.105-.814 2-1.818 2H3.818C2.814 17 2 16.105 2 15v-2c0-1.105.814-2 1.818-2ZM4 13v2h16v-2H4Zm0-8v2h16V5H4Zm10 14H2v2h12v-2Z"
      clip-rule="evenodd"
    />
  </svg>
);
