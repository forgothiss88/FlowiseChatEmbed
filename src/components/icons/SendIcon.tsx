import { splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

export const SendIcon = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => {
  const [selectedProps, otherProps] = splitProps(props, ['width', 'height']);
  return (
    // import svg from assets folder
    <svg
      width={selectedProps.width || '24'}
      height={selectedProps.height || '24'}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <path d="M20.7823 3.21751C20.681 3.11677 20.5532 3.04701 20.4137 3.01646C20.2742 2.9859 20.1288 2.9958 19.9948 3.04501L3.49476 9.04501C3.35246 9.09898 3.22995 9.19497 3.14349 9.32023C3.05704 9.44548 3.01074 9.59407 3.01074 9.74626C3.01074 9.89845 3.05704 10.047 3.14349 10.1723C3.22995 10.2975 3.35246 10.3935 3.49476 10.4475L9.93726 13.02L14.6923 8.25001L15.7498 9.30751L10.9723 14.085L13.5523 20.5275C13.6078 20.6671 13.704 20.7867 13.8284 20.8709C13.9528 20.9552 14.0995 21.0002 14.2498 21C14.4013 20.9969 14.5484 20.9479 14.6716 20.8596C14.7947 20.7712 14.8882 20.6476 14.9398 20.505L20.9398 4.00501C20.9909 3.87232 21.0032 3.72783 20.9753 3.5884C20.9474 3.44897 20.8805 3.32034 20.7823 3.21751Z" />
    </svg>
  );
};
