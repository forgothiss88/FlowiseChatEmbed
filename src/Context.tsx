import { createContext, useContext } from 'solid-js';
import { FullBotProps } from './components/types/botprops';

const CounterContext = createContext();

export const CustomerProvider = (props: FullBotProps & { children: any }) => {
  return <CounterContext.Provider value={props}>{props.children}</CounterContext.Provider>;
};

export const accessFullBotProps = (): FullBotProps => {
  return useContext(CounterContext);
};
