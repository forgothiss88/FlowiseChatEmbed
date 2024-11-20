import { splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

export const XIcon = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => {
  const [selected_props, other_props] = splitProps(props, ['fill', 'width', 'height']);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={selected_props.width || '20'}
      height={selected_props.height || '20'}
      viewBox="0 0 20 20"
      {...other_props}
    >
      <path
        d="M8.5859 10L0.792969 2.20706L2.20718 0.79285L10.0001 8.5857L17.793 0.79285L19.2072 2.20706L11.4143 10L19.2072 17.7928L17.793 19.2071L10.0001 11.4142L2.20718 19.2071L0.792969 17.7928L8.5859 10Z"
        fill={selected_props.fill}
      />
    </svg>
  );
};
