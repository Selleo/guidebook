import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

import { PaginationItem } from './PaginationItem';

type PaginationProps = {
  length: number;
  offsetX: SharedValue<number>;
};

export const Pagination: FC<PaginationProps> = ({ length, offsetX }) => (
  <View style={styles.container}>
    {[...Array(length).keys()].map((_, index) => (
      <PaginationItem
        key={index.toString()}
        itemIndex={index}
        offsetX={offsetX}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
