import { JSX, splitProps } from 'solid-js';

export const HintStars = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => {
  const [selectedProps, otherProps] = splitProps(props, ['fill', 'width', 'height']);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={selectedProps.fill}
      width={selectedProps.width || '14'}
      height={selectedProps.height || '14'}
      viewBox="0 0 14 14"
      style={{
        fill: selectedProps.fill ? '' : 'rgb(var(--brand-action-primary))',
      }}
      {...otherProps}
    >
      <g opacity="0.65">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3.54492 6.98449L4.72656 3.43957H5.45169L6.63333 6.98449L10.1783 8.16613V8.89126L6.63333 10.0729L5.45169 13.6178H4.72656L3.54492 10.0729L0 8.89126V8.16613L3.54492 6.98449Z"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.233 2.20731L10.8414 0.382172H11.5665L12.1749 2.20731L14 2.81569V3.54081L12.1749 4.14919L11.5665 5.97433H10.8414L10.233 4.14919L8.40784 3.54081V2.81569L10.233 2.20731Z"
        />
      </g>
    </svg>
  );
};
