import { FC } from 'react';
import { useWindowDimensions } from 'react-native';

import { CenterView } from '@/components/CenterView';
import { Typography } from '@/components/Typography';

export type OnboardingItem = {
  text: string;
};

type ListItemProps = {
  item: OnboardingItem;
  listIndex: number;
};

export const OnboardingListItem: FC<ListItemProps> = ({ item }) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  return (
    <CenterView style={{ width: SCREEN_WIDTH }}>
      <Typography.Header>{item.text}</Typography.Header>
    </CenterView>
  );
};
