import { BubbleParams } from '@/features/bubble/types';
import { BotProps } from './Bot';

type BrandProps = {
  brandColors: {
    primary: string;
    secondary: string;
    actionPrimary: string;
    actionSecondary: string;
  };
};

export type FullProps = BotProps & BubbleParams & BrandProps;
