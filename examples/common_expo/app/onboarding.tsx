import Animated, {
  useAnimatedRef,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import {
  NextButton,
  OnboardingListItem,
  OnboardingItem,
} from '@/components/Onboarding';

const items: OnboardingItem[] = [
  { text: 'First' },
  { text: 'Second' },
  { text: 'Third' },
];

export default function Onboarding() {
  const flatListIndex = useSharedValue(0);
  const flatListRef = useAnimatedRef<Animated.FlatList<OnboardingItem>>();

  return (
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
        bounces={false}
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
      />
      <View style={styles.bottomPanel}>
        <NextButton
          flatListRef={flatListRef}
          listIndex={flatListIndex}
          listLength={items.length}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomPanel: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
  },
});
