type Props = {
  poweredByTextColor: string;
};

export const Badge = (props: Props) => {
  return (
    <span class="twi-text-jost twi-text-xs" style={{ color: props.poweredByTextColor }}>
      Powered by
      <span class="twi-font-semibold"> @Twini</span>
    </span>
  );
};
