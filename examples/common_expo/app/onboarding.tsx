import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import {
  NextButton,
  OnboardingListItem,
  OnboardingItem,
  OnboardingWrapper,
  Pagination,
} from '@/components/Onboarding';

const items: OnboardingItem[] = [
  { text: 'First' },
  { text: 'Second' },
  { text: 'Third' },
];

export default function Onboarding() {
  const offsetX = useSharedValue(0);
  const flatListIndex = useSharedValue(0);
  const flatListRef = useAnimatedRef<Animated.FlatList<OnboardingItem>>();

  const handleOnScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      offsetX.value = event.contentOffset.x;
    },
  });

  return (
    <OnboardingWrapper>
      <SafeAreaView style={styles.container}>
        <Animated.FlatList
          ref={flatListRef}
          data={items}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <OnboardingListItem item={item} listIndex={index} />
          )}
          onViewableItemsChanged={({ viewableItems }) => {
            flatListIndex.value = viewableItems[0].index ?? 0;
          }}
          onScroll={handleOnScroll}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
        />
        <View style={styles.bottomPanel}>
          <Pagination length={items.length} offsetX={offsetX} />
          <NextButton
            flatListRef={flatListRef}
            listIndex={flatListIndex}
            listLength={items.length}
          />
        </View>
      </SafeAreaView>
    </OnboardingWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
});
