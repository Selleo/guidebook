import { FC, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  AnimatedRef,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';

import { OnboardingItem } from './OnboardingListItem';

type NextButtonProps = {
  flatListRef: AnimatedRef<Animated.FlatList<OnboardingItem>>;
  listIndex: SharedValue<number>;
  listLength: number;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const NextButton: FC<NextButtonProps> = ({
  flatListRef,
  listIndex,
  listLength,
}) => {
  const animatedButtonStyle = useAnimatedStyle(() => ({
    width:
      listIndex.value === listLength - 1 ? withTiming(120) : withTiming(60),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: listIndex.value === listLength - 1 ? withTiming(1) : withTiming(0),
    transform: [
      {
        translateX:
          listIndex.value === listLength - 1 ? withTiming(0) : withTiming(100),
      },
    ],
  }));

  const handleOnPress = useCallback(() => {
    if (listIndex.value === listLength - 1) {
      router.replace('/sign-in');
      return;
    }

    flatListRef.current?.scrollToIndex({ index: listIndex.value + 1 });
  }, [flatListRef, listIndex.value, listLength]);

  return (
    <AnimatedPressable
      onPress={handleOnPress}
      style={[styles.button, animatedButtonStyle]}
    >
      <Animated.Text style={[styles.textStyle, animatedTextStyle]}>
        Start
      </Animated.Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'blue',
    borderRadius: 80,
    height: 60,
    justifyContent: 'center',
  },
  textStyle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
