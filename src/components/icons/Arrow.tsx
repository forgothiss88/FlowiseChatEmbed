export type arrowProps = {
  classList?: string[];
  width: number;
  height: number;
};

export const LeftArrow = (props: arrowProps) => (
  <svg
    class={'text-gray-600 ' + props.classList?.join(' ')}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    fill="none"
    viewBox={`0 0 ${props.width} ${props.height}`}
  >
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7" />
  </svg>
);

export const RightArrow = (props: arrowProps) => (
  <svg
    class={'text-gray-600 ' + props.classList?.join(' ')}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    fill="none"
    viewBox={`0 0 ${props.width} ${props.height}`}
  >
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
  </svg>
);

export const UpArrow = (props: arrowProps) => (
  <svg
    class={'text-gray-600 ' + props.classList?.join(' ')}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    fill="none"
    viewBox={`0 0 ${props.width} ${props.height}`}
  >
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 15 7-7 7 7" />
  </svg>
);

export const DownArrow = (props: arrowProps) => (
  <svg
    class={'text-gray-600 ' + props.classList?.join(' ')}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    fill="none"
    viewBox={`0 0 ${props.width} ${props.height}`}
  >
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
  </svg>
);
