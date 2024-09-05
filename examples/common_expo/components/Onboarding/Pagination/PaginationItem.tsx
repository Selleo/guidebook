import { FC } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

type PaginationItemProps = {
  itemIndex: number;
  offsetX: SharedValue<number>;
};

export const PaginationItem: FC<PaginationItemProps> = ({
  itemIndex,
  offsetX,
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const animatedItemStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      offsetX.value,
      [
        (itemIndex - 1) * SCREEN_WIDTH,
        itemIndex * SCREEN_WIDTH,
        (itemIndex + 1) * SCREEN_WIDTH,
      ],
      ['#e2e2e2', 'blue', '#e2e2e2'],
    );

    const width = interpolate(
      offsetX.value,
      [
        (itemIndex - 1) * SCREEN_WIDTH,
        itemIndex * SCREEN_WIDTH,
        (itemIndex + 1) * SCREEN_WIDTH,
      ],
      [32, 16, 32],
      Extrapolation.CLAMP,
    );

    return {
      width,
      backgroundColor,
    };
  });

  return <Animated.View style={[styles.item, animatedItemStyle]} />;
};

const styles = StyleSheet.create({
  item: {
    borderRadius: 5,
    height: 10,
    marginHorizontal: 4,
    width: 32,
  },
});
