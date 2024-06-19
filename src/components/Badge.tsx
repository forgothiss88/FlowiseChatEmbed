import { onCleanup, onMount } from 'solid-js';

type Props = {
  poweredByTextColor?: string;
};

export const Badge = (props: Props) => {
  return (
    <span class="text-jost text-xs" style={{ color: props.poweredByTextColor }}>
      Powered by
      <span class="font-semibold"> @Twini</span>
    </span>
  );
};
